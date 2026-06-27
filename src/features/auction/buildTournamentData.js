import { tournament } from './content';

// Each division in content.js maps to the category gender it holds. Reusing
// tournament.divisions keeps the same id/name/order the engine (and the gender
// selector tabs in Hub) already expect.
const DIVISION_GENDER = { varonil: 'M', femenil: 'F' };

// Flat DB pair (from useSortedPairs) → the engine's pair shape.
function toAuctionPair(p) {
  return {
    id: p.id,
    a: p.players[0],
    b: p.players[1],
    bid: p.amount || 0,
    photoA: p.photos[0] || null,
    photoB: p.photos[1] || null,
    omit: false,
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
    groups.get(groupName).push(toAuctionPair(p));
  }

  const toCategory = (c) => ({
    name: c.name,
    groups: [...(groupsByCategory.get(c.name)?.entries() ?? [])].map(
      ([gName, pairs]) => ({ name: gName, pairs }),
    ),
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
