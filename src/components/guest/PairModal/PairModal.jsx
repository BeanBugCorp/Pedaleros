import { fmt, initials } from '../utils'
import './PairModal.css'

export default function PairModal({ pair, onClose, onBack }) {
  const [p1, p2] = pair.players
  const [ph1, ph2] = pair.photos

  return (
    <div className="pair-modal-overlay" onClick={onClose}>
      <div className="pair-modal" onClick={(e) => e.stopPropagation()}>
        {onBack && (
          <button
            className="pair-modal-back"
            onClick={onBack}
            aria-label="Volver"
          >
            ← Volver
          </button>
        )}
        <button
          className="pair-modal-close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✕
        </button>
        <h2 className="pair-modal-title">
          {pair.categoria} — {pair.grupo}
        </h2>
        <div className="pair-modal-players">
          <div className="pair-modal-player">
            <div className="pair-modal-name">{p1}</div>
            {ph1 ? (
              <img className="pair-photo" src={ph1} alt={p1} />
            ) : (
              <div className="pair-photo-placeholder">{initials(p1)}</div>
            )}
          </div>
          <div className="pair-modal-player">
            <div className="pair-modal-name">{p2}</div>
            {ph2 ? (
              <img className="pair-photo" src={ph2} alt={p2} />
            ) : (
              <div className="pair-photo-placeholder">{initials(p2)}</div>
            )}
          </div>
        </div>
        <div className="pair-amount-pill">
          <svg
            viewBox="0 0 300 64"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0,18 Q150,2 300,18"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeOpacity="0.7"
            />
            <path
              d="M0,46 Q150,62 300,46"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeOpacity="0.7"
            />
          </svg>
          <span className="pill-text">{fmt(pair.amount)}</span>
        </div>
      </div>
    </div>
  )
}
