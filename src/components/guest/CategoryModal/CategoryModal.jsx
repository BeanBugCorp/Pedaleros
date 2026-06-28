import PairRow from '../PairRow/PairRow'
import { fmt } from '../utils'
import './CategoryModal.css'

export default function CategoryModal({
  categoria,
  catPairs,
  onClose,
  onSelectPair,
}) {
  const categoryPool = catPairs.reduce((s, p) => s + p.amount, 0)

  return (
    <div className="cat-modal-overlay" onClick={onClose}>
      <div className="cat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cat-modal-header">
          <h2 className="cat-modal-title">{categoria}</h2>
          <button
            className="cat-modal-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <div className="cat-modal-list">
          <div className="rows">
            {catPairs.map((p, i) => (
              <PairRow
                key={p.id}
                rank={i + 1}
                pareja={p.pareja}
                grupo={p.grupo}
                amount={p.amount}
                leader={i === 0}
                onClick={() => onSelectPair(p)}
              />
            ))}
          </div>
        </div>
        <div className="cat-modal-footer">
          <div className="cat-modal-footer-label">Pozo de categoría</div>
          <div className="cat-modal-footer-amount">{fmt(categoryPool)}</div>
        </div>
      </div>
    </div>
  )
}
