import { useState } from 'react';
import styles from './Edit.module.css';

/**
 * Edit — organizer edit screen for ONE category. CSP-clean (same rules as Hub/LiveAuction):
 * static styling in Edit.module.css, no inline <style>, no inline scripts.
 *
 * Props:
 *  - category:  { name, groups: [{ name, pairs: [{a,b,bid,omit?}] }] }  one category from content.js
 *  - onBack():  return to the Hub
 *  - onChange(category):  OPTIONAL — called after every edit with the updated category,
 *                         so you can persist to your store/DB. If omitted, edits stay in
 *                         the in-memory objects (which are references into `tournament`).
 */
export default function Edit({ category, onBack, onChange }) {
  const [, force] = useState(0);
  const rerender = () => {
    force((n) => n + 1);
    onChange?.(category);
  };

  const fmt = (n) => (n ? Number(n).toLocaleString('en-US') : '');

  const setName = (pair, key, value) => {
    pair[key] = value;
    rerender();
  };
  const setBid = (pair, value) => {
    pair.bid = parseInt((value || '').replace(/[^0-9]/g, '') || '0', 10);
    rerender();
  };
  const toggleOmit = (pair) => {
    pair.omit = !pair.omit;
    if (pair.omit) pair.bid = 0;
    rerender();
  };

  if (!category) return null;

  return (
    <div className={styles.page}>
      <div className={styles.bg} />

      <div className={styles.inner}>
        <div className={styles.header}>
          <button className={styles.back} onClick={onBack}>‹ VOLVER</button>
          <h2 className={styles.h2}>EDITAR · {category.name}</h2>
        </div>

        {category.groups.map((g) => (
          <div key={g.name} className={styles.groupCard}>
            <div className={styles.groupName}>{g.name}</div>

            {g.pairs.map((pair, i) => (
              <div key={i} className={styles.pairRow}>
                <input
                  className={styles.nameInput}
                  value={pair.a}
                  onChange={(e) => setName(pair, 'a', e.target.value)}
                  aria-label="Jugador A"
                />
                <span className={styles.slash}>/</span>
                <input
                  className={styles.nameInput}
                  value={pair.b}
                  onChange={(e) => setName(pair, 'b', e.target.value)}
                  aria-label="Jugador B"
                />

                <div className={styles.bidWrap}>
                  <span className={styles.bidPrefix}>$</span>
                  <input
                    className={styles.bidInput}
                    value={fmt(pair.bid)}
                    onChange={(e) => setBid(pair, e.target.value)}
                    placeholder="0"
                    inputMode="numeric"
                    aria-label="Apuesta"
                  />
                </div>

                <button
                  className={pair.omit ? styles.omitOn : styles.omitOff}
                  onClick={() => toggleOmit(pair)}
                >
                  {pair.omit ? 'OMITIDA' : 'OMITIR'}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
