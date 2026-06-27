import { useMemo, useState } from 'react';
import styles from './Hub.module.css';

/**
 * Hub / Categories — the starting page. CSP-clean (same rules as LiveAuction):
 * static styling in Hub.module.css, no inline <style>, no inline scripts.
 *
 * Props:
 *  - data:            the `tournament` object from content.js
 *  - onStartGroup(category, group, pairs):    launch one group's auction
 *  - onStartCategory(category, pairs):         launch the whole category (all groups flattened)
 *  - onEdit(category):                         open organizer edit for a category (optional)
 */
export default function Hub({ data, onStartGroup, onStartCategory, onEdit }) {
  const [divIdx, setDivIdx] = useState(0);
  const division = data.divisions[divIdx];

  // pot / max / count across the whole tournament
  const stats = useMemo(() => {
    let pot = 0, max = 0, count = 0;
    data.divisions.forEach((d) =>
      d.categories.forEach((c) =>
        c.groups.forEach((g) =>
          g.pairs.forEach((p) => {
            count += 1;
            pot += p.bid || 0;
            if ((p.bid || 0) > max) max = p.bid || 0;
          })
        )
      )
    );
    return { pot, max, count };
  }, [data]);

  const money = (n) => '$' + (n || 0).toLocaleString('en-US');

  const groupMeta = (g) => {
    const done = g.pairs.every((p) => p.bid > 0 || p.omit);
    return done ? 'LISTO' : `${g.pairs.length} parejas`;
  };

  const startCategory = (cat) => {
    // flatten all groups; tag each pair with its group for the live crumb
    const pairs = [];
    cat.groups.forEach((g) =>
      g.pairs.forEach((p) => pairs.push({ ...p, group: g.name }))
    );
    onStartCategory?.(cat.name, pairs);
  };

  return (
    <div className={styles.page}>
      <div className={styles.bg} />

      <div className={styles.inner}>
        {/* ---- header ---- */}
        <div className={styles.header}>
          <div>
            <div className={styles.brand}>FLOÜ</div>
            <h1 className={styles.h1}>{data.name}</h1>
            <div className={styles.sub}>
              {data.club} &nbsp;·&nbsp; {data.dates}
            </div>
          </div>
          <div className={styles.tabs}>
            {data.divisions.map((d, i) => (
              <button
                key={d.id}
                className={i === divIdx ? styles.tabActive : styles.tab}
                onClick={() => setDivIdx(i)}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        {/* ---- stat strip ---- */}
        <div className={styles.statStrip}>
          <div className={styles.stat}>
            <div className={styles.statLabel}>POZO TOTAL</div>
            <div className={styles.statValue}>{money(stats.pot)}</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>MAX GANANCIA</div>
            <div className={styles.statValue}>{money(stats.max)}</div>
          </div>
          <div className={`${styles.stat} ${styles.statLast}`}>
            <div className={styles.statLabel}># PAREJAS</div>
            <div className={styles.statValue}>{stats.count}</div>
          </div>
        </div>

        {/* ---- division heading ---- */}
        <div className={styles.headingRow}>
          <h2 className={styles.h2}>{division.name}</h2>
          <div className={styles.rule} />
          <div className={styles.headingLabel}>CATEGORÍAS</div>
        </div>

        {/* ---- category cards ---- */}
        <div className={styles.cards}>
          {division.categories.map((cat) => (
            <div key={cat.name} className={styles.card}>
              <span className={`${styles.bulb} ${styles.bulbTop}`} />
              <span className={`${styles.bulb} ${styles.bulbBottom}`} />
              <span className={`${styles.bulb} ${styles.bulbLeft}`} />
              <span className={`${styles.bulb} ${styles.bulbRight}`} />

              <div className={styles.arch}>
                <span className={styles.archText}>{cat.name}</span>
              </div>

              <div className={styles.groups}>
                {cat.groups.map((g) => (
                  <button
                    key={g.name}
                    className={styles.groupBtn}
                    onClick={() =>
                      onStartGroup?.(cat.name, g.name, g.pairs.map((p) => ({ ...p, group: g.name })))
                    }
                  >
                    <span>{g.name}</span>
                    <span className={styles.groupMeta}>{groupMeta(g)}</span>
                  </button>
                ))}
              </div>

              <div className={styles.actions}>
                <button className={styles.subastar} onClick={() => startCategory(cat)}>
                  SUBASTAR
                </button>
                <button className={styles.editar} onClick={() => onEdit?.(cat)}>
                  EDITAR
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          © 2026 CALCUTA FLOÜ · PEDALEROS
          <div className = {styles.brand}>
            <img
            className = {styles.logo}
            src="/beanbug-logo.png"
            alt = "BeanBug Corp"
            />
            <a
              className= {styles.link}
              href="https://beanbugcorp.com"
              target="_blank"
              rel="noreferrer"
            >
              beanbugcorp.com
            </a>
            </div>
  
        </div>
      </div>
    </div>
  );
}
