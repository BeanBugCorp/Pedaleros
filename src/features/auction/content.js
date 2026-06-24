/* ===========================================================================
   content.js — tournament data (single source of truth for now).
   The team will later replace this with values from the database.

   Shape:
     tournament.divisions[]            e.g. Varonil, Femenil
       .categories[]                   e.g. Open, SUMA3, 3RA
         .groups[]                     e.g. Grupo 1…n
           .pairs[] = { a, b, bid, photoA?, photoB? }
               a, b     player surnames (one team)
               bid      current bid in MXN (0 = not yet bid)
               photoA/B optional image URL; omit/null → styled placeholder

   To add photos later:
     { a: 'Guzmán', b: 'Nava', bid: 32000, photoA: '/players/guzman.jpg', photoB: '/players/nava.jpg' }
   =========================================================================== */

export const tournament = {
  name: 'TORNEO 2DO ANIVERSARIO',
  club: 'FLOÜ PADEL CLUB',
  dates: '15–19 JUL 2026',
  footer: '© 2026 CALCUTA FLOÜ · PEDALEROS',

  divisions: [
    {
      id: 'varonil',
      name: 'Varonil',
      categories: [
        {
          name: 'Open',
          groups: [
            {
              name: 'Grupo 1',
              pairs: [
                { a: 'Aguilar', b: 'Cruz', bid: 17250 },
                { a: 'Herrera', b: 'León', bid: 0 },
                { a: 'Vega', b: 'Ortiz', bid: 0 },
              ],
            },
            {
              name: 'Grupo 2',
              pairs: [
                { a: 'Torres', b: 'Ibarra', bid: 28500 },
                { a: 'Castro', b: 'Rubio', bid: 0 },
                { a: 'Lara', b: 'Pineda', bid: 0 },
              ],
            },
            {
              name: 'Grupo 3',
              pairs: [
                { a: 'Mora', b: 'Gallardo', bid: 0 },
                { a: 'Salas', b: 'Cabrera', bid: 0 },
                { a: 'Duarte', b: 'Fuentes', bid: 0 },
              ],
            },
            {
              name: 'Grupo 4',
              pairs: [
                { a: 'Guzmán', b: 'Nava', bid: 32000 },
                { a: 'Ríos', b: 'Acosta', bid: 0 },
                { a: 'Bravo', b: 'Carrillo', bid: 0 },
              ],
            },
          ],
        },
        {
          name: 'SUMA3',
          groups: [
            {
              name: 'Grupo 1',
              pairs: [
                { a: 'Domínguez', b: 'Esquivel', bid: 0 },
                { a: 'Figueroa', b: 'Galindo', bid: 0 },
                { a: 'Núñez', b: 'Paredes', bid: 0 },
              ],
            },
            {
              name: 'Grupo 2',
              pairs: [
                { a: 'Quiroz', b: 'Rangel', bid: 0 },
                { a: 'Soto', b: 'Téllez', bid: 0 },
                { a: 'Ugalde', b: 'Vidal', bid: 0 },
              ],
            },
            {
              name: 'Grupo 3',
              pairs: [
                { a: 'Wong', b: 'Ybarra', bid: 0 },
                { a: 'Zamora', b: 'Alfaro', bid: 0 },
                { a: 'Beltrán', b: 'Cano', bid: 0 },
              ],
            },
          ],
        },
        {
          name: '3RA',
          groups: [
            {
              name: 'Grupo 1',
              pairs: [
                { a: 'Delgado', b: 'Espinoza', bid: 0 },
                { a: 'Fierro', b: 'Guerra', bid: 0 },
                { a: 'Hidalgo', b: 'Izar', bid: 0 },
              ],
            },
            {
              name: 'Grupo 2',
              pairs: [
                { a: 'Juárez', b: 'Marín', bid: 0 },
                { a: 'Lozano', b: 'Ponce', bid: 0 },
                { a: 'Olvera', b: 'Quezada', bid: 0 },
              ],
            },
            {
              name: 'Grupo 3',
              pairs: [
                { a: 'Quintero', b: 'Robles', bid: 0 },
                { a: 'Serrano', b: 'Trejo', bid: 0 },
                { a: 'Urías', b: 'Valdez', bid: 0 },
              ],
            },
            {
              name: 'Grupo 4',
              pairs: [
                { a: 'Ávila', b: 'Bernal', bid: 0 },
                { a: 'Cuéllar', b: 'Durán', bid: 0 },
                { a: 'Espino', b: 'Fonseca', bid: 0 },
              ],
            },
            {
              name: 'Grupo 5',
              pairs: [
                { a: 'Echeverría', b: 'Flores', bid: 0 },
                { a: 'Gómez', b: 'Huerta', bid: 0 },
                { a: 'Ibáñez', b: 'Jiménez', bid: 0 },
              ],
            },
          ],
        },
      ],
    },

    {
      id: 'femenil',
      name: 'Femenil',
      categories: [
        {
          name: 'Femenil A',
          groups: [
            {
              name: 'Grupo 1',
              pairs: [
                { a: 'Camacho', b: 'Solís', bid: 24000 },
                { a: 'Reyes', b: 'Mejía', bid: 0 },
                { a: 'Luna', b: 'Prado', bid: 0 },
              ],
            },
            {
              name: 'Grupo 2',
              pairs: [
                { a: 'Mendoza', b: 'Navarro', bid: 0 },
                { a: 'Ochoa', b: 'Ramos', bid: 0 },
                { a: 'Sandoval', b: 'Tapia', bid: 0 },
              ],
            },
          ],
        },
        {
          name: 'Femenil B',
          groups: [
            {
              name: 'Grupo 1',
              pairs: [
                { a: 'Salinas', b: 'Tovar', bid: 0 },
                { a: 'Ulloa', b: 'Vargas', bid: 0 },
                { a: 'Williams', b: 'Yáñez', bid: 0 },
              ],
            },
            {
              name: 'Grupo 2',
              pairs: [
                { a: 'Zúñiga', b: 'Arce', bid: 0 },
                { a: 'Bonilla', b: 'Cisneros', bid: 0 },
                { a: 'Díaz', b: 'Estrada', bid: 0 },
              ],
            },
            {
              name: 'Grupo 3',
              pairs: [
                { a: 'Franco', b: 'Garza', bid: 0 },
                { a: 'Haro', b: 'Iglesias', bid: 0 },
                { a: 'Kuri', b: 'Lemus', bid: 0 },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/* Auction tiers (MXN). Tweakable per tournament. */
export const thresholds = { spark: 1000, fire: 5000, jackpot: 10000 };
