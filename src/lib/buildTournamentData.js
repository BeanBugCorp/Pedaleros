import { tournament } from '../features/auction/content';

// Each division in content.js maps to the category gender it holds. Reusing
// tournament.divisions keeps the same id/name/order the engine (and the gender
// selector tabs in Hub) already expect.
const DIVISION_GENDER = { varonil: 'M', femenil: 'F' };

// Flat DB pair (from useSortedPairs) → the engine's pair shape. Extra fields
// (category, teamName, status) ride along so edit_pair can do a full update.
function toAuctionPair(p, groupName) {
  return {
    id: p.id,
    a: p.players[0],
    b: p.players[1],
    bid: p.amount || 0,
    photoA: p.photos[0] || null,
    photoB: p.photos[1] || null,
    omit: false,
    categoria: p.categoria,
    teamName: p.teamName ?? null,
    status: p.status ?? null,
    groupLabel: groupName,
  };
}

// Engine pair → the input shape expected by useEditPair/edit_pair.
export function toEditPairInput(pair) {
  return {
    id: pair.id,
    player1: pair.a,
    player2: pair.b,
    teamName: pair.teamName ?? null,
    photoUrl1: pair.photoA ?? null,
    photoUrl2: pair.photoB ?? null,
    groupLabel: pair.groupLabel ?? pair.group ?? null,
    status: pair.status ?? null,
    saleAmount: pair.bid || 0,
    group: pair.group ?? pair.groupLabel ?? null,
  };
}

/**
 * Builds the nested tournament shape the auction engine expects
 * (divisions → categories → groups → pairs) from the flat DB hooks, keeping
 * the static tournament metadata (name/club/dates/footer/division tabs).
 */
export function buildTournamentData(categories, sortedPairs) {
  // Group each category's pairs by group label.
  const groupsByCategory = new Map(categories.map((c) => [c.name, new Map()]));

  for (const p of sortedPairs) {
    if (!groupsByCategory.has(p.categoria)) {
      groupsByCategory.set(p.categoria, new Map());
    }
    const groups = groupsByCategory.get(p.categoria);
    const groupName = p.grupo || 'Único';
    if (!groups.has(groupName)) groups.set(groupName, []);
    groups.get(groupName).push(toAuctionPair(p, groupName));
  }

  const toCategory = (c) => ({
    name: c.name,
    groups: [...(groupsByCategory.get(c.name)?.entries() ?? [])]
      .map(([gName, pairs]) => ({ name: gName, pairs }))
      // Groups sorted alphabetically ascending by name.
      .sort((a, b) => a.name.localeCompare(b.name)),
  });

  // Split categories into the content.js divisions by gender; drop empties.
  const divisions = tournament.divisions
    .map((d) => ({
      id: d.id,
      name: d.name,
      categories: categories
        .filter((c) => c.gender === DIVISION_GENDER[d.id])
        .map(toCategory),
    }))
    .filter((d) => d.categories.length > 0);

  return {
    ...tournament,
    // Fallback keeps Hub from crashing before categories load.
    divisions: divisions.length
      ? divisions
      : [{ id: 'all', name: 'General', categories: [] }],
  };
}
