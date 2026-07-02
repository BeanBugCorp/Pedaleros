import { useState } from 'react';
import Hub from '../../components/auction/Hub/Hub';
import LiveAuction from '../../components/auction/LiveAuction/LiveAuction';
import Edit from '../../components/auction/Edit/Edit';
import { thresholds } from '../../data/content';
import { useAuctionData, useEditPair } from '../../hooks/useAuctionData';
import { toEditPairInput } from '../../lib/buildTournamentData';
import './auction.global.css'; // reduced-motion switch, imported once for the whole auction feature

// TODO: source this from routing/props once events are selectable.
const EVENT_ID = 'e610f10c-9aad-401f-b5bc-06bce2df9439';

/**
 * AuctionPage — wires the Hub (starting page) to the Live Auction.
 * Mounted at /auction in the main router. Pure local state; swap onConfirm/onOmit
 * for DB writes when the backend is wired up.
 */
export default function AuctionPage() {
  const [view, setView] = useState({ screen: 'hub' });

  // DB categories + pairs, already reshaped into the tournament structure.
  const { data, reload } = useAuctionData(EVENT_ID);
  const { editPair } = useEditPair();

  const goHub = () => setView({ screen: 'hub' });

  // Persists a pair via edit_pair (maps the engine pair to the function input).
  const persistPair = (pair) => editPair(toEditPairInput(pair));

  // Open the edit screen by category name and pull fresh data from the DB.
  const openEdit = (category) => {
    reload();
    setView({ screen: 'edit', category: category.name });
  };

  // Resolve the category to edit from the current (possibly just-refetched)
  // data, so Edit always reflects the latest DB values rather than a snapshot.
  const editCategory =
    view.screen === 'edit'
      ? (data.divisions
          .flatMap((d) => d.categories)
          .find((c) => c.name === view.category) ?? null)
      : null;

  return (
    <>
      {view.screen === 'hub' && (
        <Hub
          data={data}
          onStartCategory={(category, pairs) =>
            setView({ screen: 'live', category, group: '', pairs })
          }
          onEdit={openEdit}
        />
      )}

      {view.screen === 'edit' && (
        <Edit
          category={editCategory}
          onBack={() => setView({ screen: 'hub' })}
          onSavePair={persistPair}
          onChange={() => {/* persist if/when you have a backend */}}
        />
      )}

      {view.screen === 'live' && (
        <LiveAuction
          pairs={view.pairs}
          category={view.category}
          group={view.group}
          thresholds={thresholds}
          intensityFx={true}
          onConfirm={(pair, amount) => {
            pair.bid = amount;
            pair.omit = false;
            pair.status = 'sold';
            persistPair(pair);
          }}
          onOmit={(pair) => {
            pair.omit = true;
            pair.bid = 0;
            pair.status = 'skipped';
            persistPair(pair);
          }}
          onClose={goHub}
          onExit={goHub}
        />
      )}
    </>
  );
}
