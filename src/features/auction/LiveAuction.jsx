import { useCallback, useMemo, useRef, useState } from 'react';
import styles from './LiveAuction.module.css';
import './auction.global.css'; // keyframes (global, bundled — CSP-safe)

/**
 * LiveAuction — Marquee variant. CSP-clean:
 *  - All STATIC styling lives in LiveAuction.module.css (CSS Modules → external bundle).
 *  - All @keyframes live in auction.global.css (external bundle).
 *  - The handful of inline `style={}` props below are DYNAMIC values only
 *    (fire opacity/transform during a transition, per-particle position/delay).
 *    React applies them via the CSSOM (element.style.x = …), which is NOT governed
 *    by CSP `style-src` — no 'unsafe-inline' needed.
 *
 * Props:
 *  - pairs:      [{ a, b, bid }]  the auction queue for this group/category
 *  - category:   string           e.g. "Open"
 *  - group:      string           e.g. "Grupo 2"
 *  - thresholds: { spark, fire, jackpot }   default 1000 / 5000 / 10000
 *  - intensityFx: boolean         master toggle for fire/particles (default true)
 *  - onConfirm(pair, amount):     called when a bid is confirmed
 *  - onOmit(pair):                called when a pair is omitted
 *  - onClose():                   close button (✕)
 *  - onExit():                    queue finished (advanced past last pair)
 */
export default function LiveAuction({
  pairs = [],
  category = '',
  group = '',
  thresholds = { spark: 200, fire: 2500, jackpot: 5000 },
  intensityFx = true,
  onConfirm,
  onOmit,
  onClose,
  onExit,
}) {
  const [pos, setPos] = useState(0);
  const [bidDigits, setBidDigits] = useState(() =>
    pairs[0]?.bid ? String(pairs[0].bid) : ''
  );
  const [celebrating, setCelebrating] = useState(false);
  const [celebrateTier, setCelebrateTier] = useState(0);
  const [celebrateOut, setCelebrateOut] = useState(false);
  const advanceTimer = useRef(null);

  const pair = pairs[pos];
  const value = parseInt(bidDigits || '0', 10);

  const tier = useMemo(() => {
    if (value >= thresholds.jackpot) return 3;
    if (value >= thresholds.fire) return 2;
    if (value >= thresholds.spark) return 1;
    return 0;
  }, [value, thresholds]);

  const fmt = (n) => (n || 0).toLocaleString('en-US');
  const bidFmt = fmt(value);
  const bidInputFmt = bidDigits ? fmt(value) : '';
  const fireOn = intensityFx && tier >= 2;

  // ---- handlers ----
  const onBidInput = (e) =>
    setBidDigits((e.target.value || '').replace(/[^0-9]/g, '').slice(0, 7));
  const addBid = (amt) => setBidDigits(String(value + amt));
  const clearBid = () => setBidDigits('');

  const advance = useCallback(() => {
    const np = pos + 1;
    setCelebrating(false);
    setCelebrateOut(false);
    if (np >= pairs.length) {
      onExit?.();
      return;
    }
    setPos(np);
    setBidDigits(pairs[np]?.bid ? String(pairs[np].bid) : '');
  }, [pos, pairs, onExit]);

  const confirmBid = () => {
    if (!pair) return;
    onConfirm?.(pair, value);
    clearTimeout(advanceTimer.current);
    setCelebrateTier(tier);
    setCelebrateOut(false);
    setCelebrating(true);
  };

  const nextPair = () => {
    if (celebrating) {
      setCelebrateOut(true);
      clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(advance, 460); // matches overlay fade
    } else {
      advance();
    }
  };

  const omit = () => {
    clearTimeout(advanceTimer.current);
    if (pair) onOmit?.(pair);
    advance();
  };

  const prev = () => {
    if (pos <= 0) return;
    clearTimeout(advanceTimer.current);
    const np = pos - 1;
    setPos(np);
    setBidDigits(pairs[np]?.bid ? String(pairs[np].bid) : '');
    setCelebrating(false);
    setCelebrateOut(false);
  };

  if (!pair) return null;

  return (
    <div className={styles.screen}>
      {/* ---------- TOP BAR ---------- */}
      <div className={styles.topbar}>
        <div className={styles.topLeft}>
          <div className={styles.crumb}>
            {category} · {group || pair.group || ''}
          </div>
          <div className={styles.crumbDim}>
            PAREJA {pos + 1} / {pairs.length}
          </div>
        </div>
        <div className={styles.title}>★ CALCUTA ★</div>
        <div className={styles.topRight}>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>
      </div>

      {/* ---------- STAGE ---------- */}
      <div className={styles.stageArea}>
        {/* jackpot ambient rain while typing */}
        {intensityFx && tier >= 3 && <JackpotRain />}

        <div className={styles.panel}>
          <span className={`${styles.bulb} ${styles.bulbTop}`} />
          <span className={`${styles.bulb} ${styles.bulbBottom}`} />
          <span className={`${styles.bulb} ${styles.bulbLeft}`} />
          <span className={`${styles.bulb} ${styles.bulbRight}`} />

          <div className={styles.row}>
            <PlayerPhoto name={pair.a} photo={pair.photoA} />

            <div className={styles.center}>
              <div className={styles.kicker}>PAREJA</div>
              <div className={styles.name}>{pair.a}</div>
              <div className={styles.slash}>/</div>
              <div className={styles.name}>{pair.b}</div>

              <TierRibbon tier={tier} />

              <div className={styles.pillWrap}>
                {tier >= 3 && <span className={styles.pillRing} />}
                <div className={styles.pill}>
                  <span className={styles.amount}>$ {bidFmt}</span>
                </div>
              </div>
            </div>

            <PlayerPhoto name={pair.b} photo={pair.photoB} />
          </div>
        </div>
      </div>

      {/* ---------- AMBIENT BOTTOM FIRE (eases in/out) ---------- */}
      <BottomFire active={fireOn} />

      {/* ---------- CONTROLS ---------- */}
      <div className={styles.controls}>
        <button className={styles.navBtn} onClick={prev} aria-label="Anterior">
          ‹
        </button>

        <div className={styles.inputWrap}>
          <span className={styles.inputPrefix}>$</span>
          <input
            className={styles.input}
            value={bidInputFmt}
            onChange={onBidInput}
            placeholder="Ingresar apuesta"
            inputMode="numeric"
          />
        </div>

        <div className={styles.chips}>
          <button className={styles.chip} onClick={() => addBid(500)}>+500</button>
          <button className={styles.chip} onClick={() => addBid(1000)}>+1K</button>
          <button className={styles.chip} onClick={() => addBid(5000)}>+5K</button>
          <button className={styles.chip} onClick={() => addBid(10000)}>+10K</button>
          <button className={`${styles.chip} ${styles.chipDim}`} onClick={clearBid}>C</button>
        </div>

        <button className={styles.omitBtn} onClick={omit}>OMITIR</button>
        <button className={styles.confirmBtn} onClick={confirmBid}>CONFIRMAR ✓</button>
      </div>

      {/* ---------- CONFIRM CELEBRATION (held until organizer advances) ---------- */}
      {celebrating && (
        <>
          <CelebrationOverlay
            tier={celebrateTier}
            amount={bidFmt}
            a={pair.a}
            b={pair.b}
            out={celebrateOut}
            fx={intensityFx}
          />
          <div className={styles.nextWrap}>
            <button className={styles.nextBtn} onClick={nextPair}>
              SIGUIENTE PAREJA →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ============================ sub-components ============================ */

function PlayerPhoto({ name, photo }) {
  return (
    <div className={styles.photo}>
      {photo ? (
        <img className={styles.photoImg} src={photo} alt={name} />
      ) : (
        <div className={styles.silhouette}>
          <div className={styles.head} />
          <div className={styles.shoulders} />
        </div>
      )}
      <div className={styles.photoCaption}>{name}</div>
    </div>
  );
}

function TierRibbon({ tier }) {
  if (tier === 1)
    return <div className={`${styles.ribbon} ${styles.ribbonSpark}`}>★ ¡SUBIENDO! ★</div>;
  if (tier === 2)
    return <div className={`${styles.ribbon} ${styles.ribbonFire}`}>🔥 ON FIRE 🔥</div>;
  if (tier === 3)
    return <div className={`${styles.ribbon} ${styles.ribbonJackpot}`}>JACKPOT</div>;
  return <div className={styles.ribbonSpacer} />;
}

/* Ambient fire pinned to the bottom of the screen, behind the controls.
   Always mounted so opacity/scaleY can TRANSITION (slow rise-in / slow fade-out). */
function BottomFire({ active }) {
  const flames = Array.from({ length: 22 }, (_, i) => {
    const h = 150 + Math.round(150 * Math.abs(Math.sin(i * 1.7 + 1)));
    return (
      <span
        key={i}
        className={styles.flame}
        style={{
          height: `${h}px`,
          animationDuration: `${0.55 + (i % 5) * 0.12}s`,
          animationDelay: `${(i % 6) * 0.08}s`,
        }}
      />
    );
  });
  return (
    <div
      className={styles.fireLayer}
      style={{
        opacity: active ? 1 : 0,
        transform: active ? 'scaleY(1)' : 'scaleY(0.12)',
      }}
    >
      <div className={styles.fireInner}>
        <div className={styles.fireGlow} />
        {flames}
      </div>
    </div>
  );
}

function JackpotRain() {
  const coins = Array.from({ length: 18 }, (_, i) => (
    <span
      key={`c${i}`}
      className={styles.coin}
      style={{
        left: `${4 + i * 5.3}%`,
        animationDuration: `${2.2 + (i % 5) * 0.4}s`,
        animationDelay: `${(i % 7) * 0.18}s`,
      }}
    >
      $
    </span>
  ));
  const colors = ['c1', 'c2', 'c3', 'c4', 'c5'];
  const conf = Array.from({ length: 32 }, (_, i) => (
    <span
      key={`f${i}`}
      className={`${styles.confetti} ${styles['conf_' + colors[i % 5]]}`}
      style={{
        left: `${1 + i * 3.1}%`,
        animationDuration: `${2.4 + (i % 6) * 0.3}s`,
        animationDelay: `${(i % 9) * 0.12}s`,
      }}
    />
  ));
  return <div className={styles.fxLayer}>{[...coins, ...conf]}</div>;
}

function CelebrationOverlay({ tier, amount, a, b, out, fx }) {
  let msg, msgClass, parts = null;

  if (tier >= 3) {
    msg = '¡JACKPOT!';
    msgClass = styles.msgJackpot;
    if (fx) {
      const coins = Array.from({ length: 18 }, (_, i) => (
        <span
          key={`gc${i}`}
          className={styles.fallCoin}
          style={{
            left: `${2 + i * 5.4}%`,
            animationDuration: `${2 + (i % 5) * 0.35}s`,
            animationDelay: `${(i % 7) * 0.16}s`,
          }}
        >
          $
        </span>
      ));
      const golds = Array.from({ length: 22 }, (_, i) => (
        <span
          key={`gr${i}`}
          className={`${styles.fallGold} ${i % 2 ? styles.fallGoldB : ''}`}
          style={{
            left: `${1 + i * 4.6}%`,
            animationDuration: `${2.2 + (i % 6) * 0.3}s`,
            animationDelay: `${(i % 9) * 0.1}s`,
          }}
        />
      ));
      parts = [...coins, ...golds];
    }
  } else if (tier === 2) {
    msg = 'ON FIRE';
    msgClass = styles.msgFire;
    if (fx)
      parts = Array.from({ length: 22 }, (_, i) => (
        <span
          key={`ff${i}`}
          className={styles.fallFlame}
          style={{
            left: `${2 + i * 4.4}%`,
            animationDuration: `${2 + (i % 5) * 0.35}s`,
            animationDelay: `${(i % 7) * 0.15}s`,
          }}
        />
      ));
  } else {
    msg = 'CONFIRMADO';
    msgClass = styles.msgConfirm;
    if (fx)
      parts = Array.from({ length: 22 }, (_, i) => (
        <span
          key={`tb${i}`}
          className={styles.fallBall}
          style={{
            left: `${2 + i * 4.4}%`,
            animationDuration: `${2 + (i % 5) * 0.35}s`,
            animationDelay: `${(i % 7) * 0.15}s`,
          }}
        />
      ));
  }

  return (
    <div
      className={styles.overlay}
      style={{ opacity: out ? 0 : 1, pointerEvents: out ? 'none' : 'auto' }}
    >
      <div className={styles.fxLayer}>{parts}</div>
      <div className={styles.message}>
        <div className={`${styles.bigMsg} ${msgClass}`}>{msg}</div>
        <div className={styles.msgAmount}>$ {amount}</div>
        <div className={styles.msgPair}>
          {a} / {b}
        </div>
      </div>
    </div>
  );
}
