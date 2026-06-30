import PairRow from '../PairRow/PairRow'
import './CategorySection.css'

export default function CategorySection({
  activeCat,
  categoryNames,
  catPairs,
  dropdownOpen,
  onDropdownToggle,
  onSelectCat,
  onOpenModal,
  onOpenCatModal,
}) {
  return (
    <>
      <div className="section-title">Por Categoría</div>

      <div className="cat-select-wrap">
        <div
          className={`cat-select${dropdownOpen ? ' open' : ''}`}
          onClick={onDropdownToggle}
        >
          <span className="label">{activeCat}</span>
          <span className="chevron">▾</span>
        </div>
        <div className={`cat-menu${dropdownOpen ? ' open' : ''}`}>
          <div className="cat-menu-inner">
            {categoryNames.map((cat) => (
              <div
                key={cat}
                className="cat-option"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectCat(cat)
                }}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rows" style={{ marginTop: '14px' }}>
        {catPairs.slice(0, 3).map((p, i, arr) => (
          <PairRow
            key={p.id}
            rank={i + 1}
            pareja={p.pareja}
            grupo={p.grupo}
            amount={p.amount}
            leader={i === 0}
            onClick={() => onOpenModal(p)}
            glowDelay={i * 1.5}
            glowDuration={arr.length * 1.5}
          />
        ))}
      </div>

      <div className="ver-todas-wrap">
        <button className="ver-todas" onClick={onOpenCatModal}>
          Ver todas →
        </button>
      </div>
    </>
  )
}
