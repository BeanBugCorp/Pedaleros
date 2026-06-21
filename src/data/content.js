// Static tournament config — edit these freely
export const tournament = {
  name: 'Torneo 2do Aniversario',
  club: 'FLOÜ Padel Club',
  dates: '15-19 JUL 2026',
  contact: 'contacto@calcutapadel.mx',
  year: 2026,
}

export const categories = ['Open', 'Femenil A', 'Varonil B']

// Placeholder pairs — pareja names + bid amounts will be replaced by a Supabase query.
// Schema (per row): { id, pareja, categoria, grupo, amount }
export const pairs = [
  { id: 1, pareja: 'Guzmán / Nava',      categoria: 'Open',      grupo: 'Grupo 4', amount: 32000 },
  { id: 2, pareja: 'Torres / Ibarra',     categoria: 'Open',      grupo: 'Grupo 2', amount: 28500 },
  { id: 3, pareja: 'Aguilar / Cruz',      categoria: 'Open',      grupo: 'Grupo 1', amount: 17250 },
  { id: 4, pareja: 'Camacho / Solís',     categoria: 'Femenil A', grupo: 'Grupo 1', amount: 24000 },
  { id: 5, pareja: 'Domínguez / Razo',    categoria: 'Femenil A', grupo: 'Grupo 2', amount: 15400 },
  { id: 6, pareja: 'Fernández / Ruiz',    categoria: 'Femenil A', grupo: 'Grupo 1', amount: 12100 },
  { id: 7, pareja: 'Reyes / Mejía',       categoria: 'Varonil B', grupo: 'Grupo 3', amount: 19800 },
  { id: 8, pareja: 'Pérez / Castillo',    categoria: 'Varonil B', grupo: 'Grupo 1', amount: 14600 },
  { id: 9, pareja: 'Morales / Díaz',      categoria: 'Varonil B', grupo: 'Grupo 2', amount: 11000 },
]
