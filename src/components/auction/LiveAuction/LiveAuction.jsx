import { useCallback, useMemo, useRef, useState } from 'react';
import styles from './LiveAuction.module.css';
import '../../../pages/auction/auction.global.css'; // keyframes (global, bundled — CSP-safe)

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
 *  - thresholds: { spark, fire, jackpot, mega, slam }   default 1000 / 5000 / 10000 / 10000 / 15000
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
  thresholds = { spark: 200, fire: 2500, jackpot: 5000, mega: 10000, slam: 15000 },
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
    if (value >= thresholds.slam) return 5;
    if (value >= thresholds.mega) return 4;
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
        {/* ambient FX while typing — highest active tier wins, fire (tier >= 2) stays underneath */}
        {intensityFx && tier === 5 && (
          <>
            <SlamWash />
            <SlamRain />
          </>
        )}
        {intensityFx && tier === 4 && <MegaRain />}
        {intensityFx && tier === 3 && <JackpotRain />}

        <div className={styles.panel}>
          <span className={`${styles.bulb} ${styles.bulbTop}`} />
          <span className={`${styles.bulb} ${styles.bulbBottom}`} />
          <span className={`${styles.bulb} ${styles.bulbLeft}`} />
          <span className={`${styles.bulb} ${styles.bulbRight}`} />

          <div className={styles.row}>
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

function TierRibbon({ tier }) {
  if (tier === 1)
    return <div className={`${styles.ribbon} ${styles.ribbonSpark}`}>★ ¡SUBIENDO! ★</div>;
  if (tier === 2)
    return <div className={`${styles.ribbon} ${styles.ribbonFire}`}>🔥 ON FIRE 🔥</div>;
  if (tier === 3)
    return <div className={`${styles.ribbon} ${styles.ribbonJackpot}`}>JACKPOT</div>;
  if (tier === 4)
    return <div className={`${styles.ribbon} ${styles.ribbonMega}`}>💥 REMATE DE ORO 💥</div>;
  if (tier === 5)
    return <div className={`${styles.ribbon} ${styles.ribbonSlam}`}>🏆 GRAND SLAM 🏆</div>;
  return <div className={styles.ribbonSpacer} />;
}

/* Ambient fire pinned to the bottom of the screen, behind the controls.
   Always mounted so opacity/scaleY can TRANSITION (slow rise-in / slow fade-out). */
function BottomFire({ active }) {
  const flames = Array.from({ length: 22 }, (_, i) => {
    const size = 48 + Math.round(52 * Math.abs(Math.sin(i * 1.7 + 1)));
    return (
      <span
        key={i}
        className={styles.flame}
        style={{
          fontSize: `${size}px`,
          animationDuration: `${0.55 + (i % 5) * 0.12}s`,
          animationDelay: `${(i % 6) * 0.08}s`,
        }}
      >🔥</span>
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

const PADEL_EMOJIS = ['🎾', '🏓', '🏆', '⚡', '🔥', '🥇', '💪'];
const ROYALTY_EMOJIS = ['🏆', '👑', '🎾', '🥇', '💛', '⭐', '🔥'];

function MegaRain() {
  const fall = Array.from({ length: 20 }, (_, i) => (
    <span
      key={`mf${i}`}
      className={styles.megaFall}
      style={{
        left: `${2 + i * 4.9}%`,
        fontSize: `${26 + (i % 5) * 6}px`,
        animationDuration: `${2.3 + (i % 6) * 0.32}s`,
        animationDelay: `${(i % 9) * 0.12}s`,
      }}
    >
      {PADEL_EMOJIS[i % PADEL_EMOJIS.length]}
    </span>
  ));
  const launchL = Array.from({ length: 9 }, (_, i) => (
    <span
      key={`ml${i}`}
      className={styles.megaLaunchLeft}
      style={{
        top: `${18 + i * 8}%`,
        fontSize: `${28 + (i % 3) * 8}px`,
        animationDuration: `${1.7 + (i % 4) * 0.3}s`,
        animationDelay: `${(i % 5) * 0.22}s`,
      }}
    >
      {PADEL_EMOJIS[i % PADEL_EMOJIS.length]}
    </span>
  ));
  const launchR = Array.from({ length: 9 }, (_, i) => (
    <span
      key={`mr${i}`}
      className={styles.megaLaunchRight}
      style={{
        top: `${18 + i * 8}%`,
        fontSize: `${28 + (i % 3) * 8}px`,
        animationDuration: `${1.7 + (i % 4) * 0.3}s`,
        animationDelay: `${(i % 5) * 0.22}s`,
      }}
    >
      {PADEL_EMOJIS[i % PADEL_EMOJIS.length]}
    </span>
  ));
  return <div className={styles.fxLayer}>{[...fall, ...launchL, ...launchR]}</div>;
}

/* stadium wash — behind the marquee panel (low z-index) */
function SlamWash() {
  return (
    <div className={styles.slamWash}>
      <div className={styles.slamVignette} />
      <div className={`${styles.slamBeam} ${styles.slamBeamL}`} />
      <div className={`${styles.slamBeam} ${styles.slamBeamR}`} />
    </div>
  );
}

/* royalty rain — above everything, like the other typing-FX layers */
function SlamRain() {
  const drops = Array.from({ length: 24 }, (_, i) => (
    <span
      key={`sr${i}`}
      className={styles.slamFall}
      style={{
        left: `${1 + i * 4.1}%`,
        fontSize: `${30 + (i % 6) * 5}px`,
        animationDuration: `${2.1 + (i % 6) * 0.3}s`,
        animationDelay: `${(i % 10) * 0.11}s`,
      }}
    >
      {ROYALTY_EMOJIS[i % ROYALTY_EMOJIS.length]}
    </span>
  ));
  return <div className={styles.fxLayer}>{drops}</div>;
}

function radialBoom(i, n) {
  const ang = (i / n) * Math.PI * 2 + (i % 2 ? 0.13 : 0);
  const dist = 240 + ((i * 97) % 240);
  return {
    tx: Math.cos(ang) * dist,
    ty: Math.sin(ang) * dist - 40,
    rot: ((i * 73) % 720 - 360) + 'deg',
  };
}

function CelebrationOverlay({ tier, amount, a, b, out, fx }) {
  let msg, msgClass, parts = null, particlesBg = null, trophy = null, subtitle = null;

  if (tier >= 5) {
    msg = '🏆 GRAND SLAM 🏆';
    msgClass = styles.msgSlam;
    trophy = <div className={styles.slamTrophy}>🏆</div>;
    subtitle = <div className={styles.slamSubtitle}>¡ESTRELLAS!</div>;
    if (fx) {
      particlesBg = (
        <>
          <div className={styles.slamFlash} />
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={`ring${i}`}
              className={styles.slamRing}
              style={{
                animationDuration: `${1.5 + i * 0.25}s`,
                animationDelay: `${i * 0.28}s`,
              }}
            />
          ))}
        </>
      );
      const cannonEmojis = ['c1', 'c2', 'c3', 'c4', 'c5'];
      const cannonsL = Array.from({ length: 26 }, (_, i) => (
        <span
          key={`cl${i}`}
          className={`${styles.cannonPiece} ${styles.cannonPieceL} ${styles['cannon_' + cannonEmojis[i % 5]]}`}
          style={{
            animationDuration: `${1.6 + (i % 6) * 0.25}s`,
            animationDelay: `${(i % 8) * 0.09}s`,
          }}
        />
      ));
      const cannonsR = Array.from({ length: 26 }, (_, i) => (
        <span
          key={`cr${i}`}
          className={`${styles.cannonPiece} ${styles.cannonPieceR} ${styles['cannon_' + cannonEmojis[i % 5]]}`}
          style={{
            animationDuration: `${1.6 + (i % 6) * 0.25}s`,
            animationDelay: `${(i % 8) * 0.09}s`,
          }}
        />
      ));
      const slamEmojis = ['🏆', '👑', '🥇', '💰', '💎', '🎾'];
      const N = 40;
      const explosion = Array.from({ length: N }, (_, i) => {
        const { tx, ty, rot } = radialBoom(i, N);
        return (
          <span
            key={`se${i}`}
            className={styles.boomPiece}
            style={{
              top: '46%',
              fontSize: `${30 + (i % 5) * 12}px`,
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
              '--rot': rot,
              animationDuration: `${1.5 + (i % 5) * 0.22}s`,
              animationDelay: `${(i % 6) * 0.05}s`,
            }}
          >
            {slamEmojis[i % slamEmojis.length]}
          </span>
        );
      });
      parts = [...cannonsL, ...cannonsR, ...explosion];
    }
  } else if (tier === 4) {
    msg = '💥 REMATE DE ORO 💥';
    msgClass = styles.msgMega;
    if (fx) {
      const megaEmojis = ['💰', '💵', '💸', '🤑', '🪙', '💎', '🏆'];
      const N = 46;
      parts = Array.from({ length: N }, (_, i) => {
        const { tx, ty, rot } = radialBoom(i, N);
        return (
          <span
            key={`me${i}`}
            className={styles.boomPiece}
            style={{
              fontSize: `${30 + (i % 5) * 12}px`,
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
              '--rot': rot,
              animationDuration: `${1.5 + (i % 5) * 0.22}s`,
              animationDelay: `${(i % 6) * 0.05}s`,
            }}
          >
            {megaEmojis[i % megaEmojis.length]}
          </span>
        );
      });
    }
  } else if (tier >= 3) {
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
        >🔥</span>
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
      {particlesBg}
      <div className={styles.fxLayer}>{parts}</div>
      <div className={styles.message}>
        {trophy}
        <div className={`${styles.bigMsg} ${msgClass}`}>{msg}</div>
        {subtitle}
        <div className={styles.msgAmount}>$ {amount}</div>
        <div className={styles.msgPair}>
          {a} / {b}
        </div>
      </div>
    </div>
  );
}
