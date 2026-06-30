import { useState } from 'react';
import styles from './Hub.module.css';
import { useEventSalesSummary } from '../../hooks/useGuestData';

// TODO: source this from routing/props once events are selectable.
const EVENT_ID = 'e610f10c-9aad-401f-b5bc-06bce2df9439';

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
export default function Hub({ data, onStartCategory, onEdit }) {
  const [divIdx, setDivIdx] = useState(0);
  const [activeGroup, setActiveGroup] = useState(null); // { catName, group }
  const division = data.divisions[divIdx];

  // pot / max / count for the event, from the DB sales summary
  const { totalSales, maxSale, numPairs } = useEventSalesSummary(EVENT_ID);

  const money = (n) => '$' + (n || 0).toLocaleString('en-US');

  const isGroupDone = (g) => g.pairs.length > 0 && g.pairs.every((p) => p.bid > 0);
  const isCatDone = (cat) => cat.groups.length > 0 && cat.groups.every(isGroupDone);
  const groupMeta = (g) => `${g.pairs.length} parejas`;

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
            <div className={styles.statValue}>{money(totalSales)}</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>MAX GANANCIA</div>
            <div className={styles.statValue}>{money(maxSale)}</div>
          </div>
          <div className={`${styles.stat} ${styles.statLast}`}>
            <div className={styles.statLabel}># PAREJAS</div>
            <div className={styles.statValue}>{numPairs}</div>
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

              <div className={`${styles.arch} ${isCatDone(cat) ? styles.archDone : ''}`}>
                <span className={styles.archText}>{cat.name}</span>
              </div>

              <div className={styles.groups}>
                {cat.groups.map((g) => (
                  <button
                    key={g.name}
                    className={styles.groupBtn}
                    onClick={() => setActiveGroup({ catName: cat.name, group: g })}
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

        {/* ---- group modal ---- */}
        {activeGroup && (
          <div className={styles.modalOverlay} onClick={() => setActiveGroup(null)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <span className={`${styles.bulb} ${styles.bulbTop}`} />
              <span className={`${styles.bulb} ${styles.bulbBottom}`} />
              <span className={`${styles.bulb} ${styles.bulbLeft}`} />
              <span className={`${styles.bulb} ${styles.bulbRight}`} />

              <div className={styles.modalHeader}>
                <div>
                  <h2 className={styles.modalH2}>{activeGroup.group.name}</h2>
                  <div className={styles.modalCatLabel}>{activeGroup.catName}</div>
                </div>
                <button className={styles.modalClose} onClick={() => setActiveGroup(null)}>
                  ‹ VOLVER
                </button>
              </div>

              <div className={styles.modalGroupCard}>
                {activeGroup.group.pairs.map((pair, i) => (
                  <div
                    key={i}
                    className={`${styles.pairRow} ${pair.omit ? styles.pairOmit : ''}`}
                  >
                    <span className={styles.nameCol}>{pair.a}</span>
                    <span className={styles.slash}>/</span>
                    <span className={styles.nameCol}>{pair.b}</span>

                    {pair.omit ? (
                      <span className={styles.omitBadge}>OMITIDA</span>
                    ) : pair.bid > 0 ? (
                      <div className={styles.bidDisplay}>
                        <span className={styles.bidPrefix}>$</span>
                        <span className={styles.bidValue}>
                          {Number(pair.bid).toLocaleString('en-US')}
                        </span>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className={styles.footer}>
          © 2026 CALCUTA FLOÜ · PEDALEROS
          <div className={styles.brand}>
            <img
              className={styles.logo}
              src="/beanbug-logo.png"
              alt="BeanBug Corp"
            />
            <a
              className={styles.link}
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
