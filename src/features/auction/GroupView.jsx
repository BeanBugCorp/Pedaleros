import styles from './GroupView.module.css';

/**
 * GroupView — read-only list of participants in a single group.
 *
 * Props:
 *  - categoryName: string  (e.g. "Open")
 *  - group: { name, pairs: [{a, b, bid, omit?}] }
 *  - onBack(): return to Hub
 */
export default function GroupView({ categoryName, group, onBack }) {
  if (!group) return null;

  const fmtBid = (n) => '$' + Number(n).toLocaleString('en-US');

  return (
    <div className={styles.page}>
      <div className={styles.bg} />

      <div className={styles.inner}>
        <div className={styles.header}>
          <button className={styles.back} onClick={onBack}>‹ VOLVER</button>
          <div>
            <h2 className={styles.h2}>{categoryName}</h2>
            <div className={styles.catLabel}>{group.name}</div>
          </div>
        </div>

        <div className={styles.groupCard}>
          <div className={styles.groupName}>{group.name}</div>

          {group.pairs.map((pair, i) => (
            <div key={i} className={`${styles.pairRow} ${pair.omit ? styles.pairOmit : ''}`}>
              <span className={styles.nameCol}>{pair.a}</span>
              <span className={styles.slash}>/</span>
              <span className={styles.nameCol}>{pair.b}</span>

              {pair.omit ? (
                <span className={styles.omitBadge}>OMITIDA</span>
              ) : pair.bid > 0 ? (
                <div className={styles.bidDisplay}>
                  <span className={styles.bidPrefix}>$</span>
                  <span className={styles.bidValue}>{Number(pair.bid).toLocaleString('en-US')}</span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
