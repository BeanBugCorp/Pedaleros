import { useState } from 'react';
import Hub from './Hub';
import LiveAuction from './LiveAuction';
import Edit from './Edit';
import { tournament } from './content'; // delete after we rescue data from DB.
import './auction.global.css'; // keyframes imported once for the whole auction feature

/**
 * AuctionPage — wires the Hub (starting page) to the Live Auction.
 * Mounted at /auction in the main router. Pure local state; swap onConfirm/onOmit
 * for DB writes when the backend is wired up.
 */
export default function AuctionPage() {
  const [view, setView] = useState({ screen: 'hub' });

  const goHub = () => setView({ screen: 'hub' });

  const thresholds = { spark: 200, fire: 2500, jackpot: 5000 };

  return (
    <>
      {view.screen === 'hub' && (
        <Hub
          data={tournament}
          onStartGroup={(category, group, pairs) =>
            setView({ screen: 'live', category, group, pairs })
          }
          onStartCategory={(category, pairs) =>
            setView({ screen: 'live', category, group: '', pairs })
          }
          onEdit={(category) => setView({ screen: 'edit', category })}
        />
      )}

      {view.screen === 'edit' && (
        <Edit
          category={view.category}
          onBack={() => setView({ screen: 'hub' })}
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
            pair.bid = amount; // in-memory persistence — replace with DB write
            pair.omit = false;
          }}
          onOmit={(pair) => {
            pair.omit = true; // in-memory persistence — replace with DB write
            pair.bid = 0;
          }}
          onClose={goHub}
          onExit={goHub}
        />
      )}
    </>
  );
}
