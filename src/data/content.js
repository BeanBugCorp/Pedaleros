// Static tournament config — edit these freely
export const tournament = {
  name: 'Torneo 2do Aniversario',
  club: 'FLOÜ Padel Club',
  dates: '15-19 JUL 2026',
  footer: '© 2026 CALCUTA FLOÜ · PEDALEROS',
  contact: 'contacto@calcutapadel.mx',
  year: 2026,
  divisions: [
    { id: 'varonil', name: 'Varonil' },
    { id: 'femenil', name: 'Femenil' },
  ],
}

/* Auction tiers (MXN). Tweakable per tournament. */
export const thresholds = { spark: 500, fire: 2500, jackpot: 5000 }

export const categories = ['Open', 'Femenil A', 'Varonil B']

// Placeholder pairs — pareja/players/photos + bid amounts will be replaced by a Supabase query.
// Schema (per row): { id, pareja, players, photos, categoria, grupo, amount }
//   pareja  → short display name shown in leaderboard rows
//   players → full names shown in the pair detail modal
//   photos  → [url1, url2] from Supabase Storage; null = show initials placeholder
export const pairs = [
  {
    id: 1,
    pareja: 'Guzmán / Nava',
    players: ['Ruy Guzmán', 'Jeshua Nava'],
    photos: [null, null],
    categoria: 'Open',
    grupo: 'Grupo 4',
    amount: 32000,
  },
  {
    id: 2,
    pareja: 'Torres / Ibarra',
    players: ['Marcos Torres', 'Felipe Ibarra'],
    photos: [null, null],
    categoria: 'Open',
    grupo: 'Grupo 2',
    amount: 28500,
  },
  {
    id: 3,
    pareja: 'Aguilar / Cruz',
    players: ['Diego Aguilar', 'Tomás Cruz'],
    photos: [null, null],
    categoria: 'Open',
    grupo: 'Grupo 1',
    amount: 17250,
  },
  {
    id: 4,
    pareja: 'Camacho / Solís',
    players: ['Ana Camacho', 'Valeria Solís'],
    photos: [null, null],
    categoria: 'Femenil A',
    grupo: 'Grupo 1',
    amount: 24000,
  },
  {
    id: 5,
    pareja: 'Domínguez / Razo',
    players: ['Sofía Domínguez', 'Daniela Razo'],
    photos: [null, null],
    categoria: 'Femenil A',
    grupo: 'Grupo 2',
    amount: 15400,
  },
  {
    id: 6,
    pareja: 'Fernández / Ruiz',
    players: ['Paula Fernández', 'Camila Ruiz'],
    photos: [null, null],
    categoria: 'Femenil A',
    grupo: 'Grupo 1',
    amount: 12100,
  },
  {
    id: 7,
    pareja: 'Reyes / Mejía',
    players: ['Carlos Reyes', 'Andrés Mejía'],
    photos: [null, null],
    categoria: 'Varonil B',
    grupo: 'Grupo 3',
    amount: 19800,
  },
  {
    id: 8,
    pareja: 'Pérez / Castillo',
    players: ['Luis Pérez', 'Roberto Castillo'],
    photos: [null, null],
    categoria: 'Varonil B',
    grupo: 'Grupo 1',
    amount: 14600,
  },
  {
    id: 9,
    pareja: 'Morales / Díaz',
    players: ['Héctor Morales', 'Ernesto Díaz'],
    photos: [null, null],
    categoria: 'Varonil B',
    grupo: 'Grupo 2',
    amount: 11000,
  },
]
