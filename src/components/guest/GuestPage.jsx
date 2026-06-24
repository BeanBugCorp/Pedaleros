import { useState } from 'react'
import { tournament } from '../../data/content'
import {
  useEventSalesSummary,
  useSortedPairs,
  useCategoryNames,
} from '../../hooks/useGuestData'
import MarqueeTitle from './MarqueeTitle'
import './GuestPage.css'

// TODO: source this from routing/props once events are selectable.
const EVENT_ID = '6311c366-3851-4bf8-a413-e86904945f76'

const fmt = (n) => '$' + Number(n).toLocaleString('en-US')

const initials = (name) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

const BallLines = () => (
  <svg viewBox="0 0 34 34" aria-hidden="true">
    <path
      d="M2,12 Q17,1 32,12"
      fill="none"
      stroke="white"
      strokeWidth="1.6"
      strokeOpacity="0.85"
    />
    <path
      d="M2,22 Q17,33 32,22"
      fill="none"
      stroke="white"
      strokeWidth="1.6"
      strokeOpacity="0.85"
    />
  </svg>
)

function PairRow({
  rank,
  pareja,
  categoria,
  grupo,
  amount,
  leader,
  onClick,
  glowDelay,
  glowDuration,
}) {
  const glowing = glowDelay !== undefined && glowDuration !== undefined
  return (
    <div
      className={`row${leader ? ' leader' : ''}${onClick ? ' clickable' : ''}${glowing ? ' glowing' : ''}`}
      style={
        glowing
          ? {
              '--glow-delay': `${glowDelay}s`,
              '--glow-duration': `${glowDuration}s`,
            }
          : undefined
      }
      onClick={onClick}
    >
      <div className="rank-ball">
        <BallLines />
        <span className="num">{rank}</span>
      </div>
      <div className="row-main">
        <div className="pareja">{pareja}</div>
        <div className="grupo">
          {categoria ? `${categoria} · ${grupo}` : grupo}
        </div>
      </div>
      <div className="amount">{fmt(amount)}</div>
    </div>
  )
}

function PairModal({ pair, onClose, onBack }) {
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

function CategoryModal({ categoria, catPairs, onClose, onSelectPair }) {
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

function SearchOverlay({ onClose, sortedAll, onSelectPair }) {
  const [query, setQuery] = useState('')

  const q = query.toLowerCase()
  const results = query.trim()
    ? sortedAll.filter((p) =>
        p.players.some((name) => name.toLowerCase().includes(q)),
      )
    : []

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-header">
          <input
            autoFocus
            type="text"
            className="search-input"
            placeholder="Buscar pareja…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="search-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <div className="search-results">
          {query.trim() === '' && (
            <p className="search-hint">Escribe el nombre de una pareja</p>
          )}
          {query.trim() !== '' && results.length === 0 && (
            <p className="search-hint">Sin resultados</p>
          )}
          {results.length > 0 && (
            <div className="rows">
              {results.map((p) => (
                <PairRow
                  key={p.id}
                  rank={sortedAll.findIndex((pp) => pp.id === p.id) + 1}
                  pareja={p.pareja}
                  categoria={p.categoria}
                  grupo={p.grupo}
                  amount={p.amount}
                  leader={false}
                  onClick={() => onSelectPair(p)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function GuestPage() {
  const [selectedCat, setSelectedCat] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [catModalOpen, setCatModalOpen] = useState(false)
  const [modalPair, setModalPair] = useState(null)
  const [modalOnBack, setModalOnBack] = useState(null)

  const { totalSales, maxSale, numPairs } = useEventSalesSummary(EVENT_ID)
  const { sortedPairs } = useSortedPairs(EVENT_ID)
  const { categoryNames } = useCategoryNames(EVENT_ID)

  // Fall back to the first DB category until the user picks one.
  const activeCat = selectedCat ?? categoryNames[0] ?? null

  // sortedPairs already comes sorted by sale amount (desc) from the DB.
  const sortedAll = sortedPairs
  const topPairs = sortedAll.slice(0, 5)
  const catPairs = sortedAll.filter((p) => p.categoria === activeCat)

  const openModal = (pair) => {
    setModalPair(pair)
    setModalOnBack(null)
  }
  const closeModal = () => {
    setModalPair(null)
    setModalOnBack(null)
  }

  const handleSelectFromSearch = (pair) => {
    setSearchOpen(false)
    setModalPair(pair)
  }

  return (
    <div className="app-layout">
      <div className="page">
        <header>
          <div className="header-marquee">
            <MarqueeTitle text="Torneo 2do|Aniversario" variant="duo" />
          </div>
          <div className="header-bottom">
            <div className="header-meta">
              <span>{tournament.club}</span>
              <span className="dates">{tournament.dates}</span>
            </div>
            <button
              className="search-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar pareja"
            >
              ⌕
            </button>
          </div>
        </header>

        <div className="tote">
          <div className="tote-stat">
            <div className="tote-label">Pozo Total</div>
            <div className="tote-value">{fmt(totalSales)}</div>
          </div>
          <div className="tote-stat">
            <div className="tote-label">Max Ganancia</div>
            <div className="tote-value">{fmt(maxSale)}</div>
          </div>
          <div className="tote-stat">
            <div className="tote-label"># Parejas</div>
            <div className="tote-value">{numPairs}</div>
          </div>
          <button
            className="search-btn"
            onClick={() => setSearchOpen(true)}
            aria-label="Buscar pareja"
          >
            ⌕
          </button>
        </div>

        <div className="section-title">Top 5 Global</div>
        <div className="rows">
          {topPairs.map((p, i) => (
            <PairRow
              key={p.id}
              rank={i + 1}
              pareja={p.pareja}
              categoria={p.categoria}
              grupo={p.grupo}
              amount={p.amount}
              leader={i === 0}
              onClick={() => openModal(p)}
            />
          ))}
        </div>

        <div className="section-title">Top 5 Global</div>
        <div className="rows">
          {topPairs.map((p, i) => (
            <PairRow
              key={p.id}
              rank={i + 1}
              pareja={p.pareja}
              categoria={p.categoria}
              grupo={p.grupo}
              amount={p.amount}
              leader={i === 0}
              onClick={() => openModal(p)}
              glowDelay={i * 1.5}
              glowDuration={7.5}
            />
          ))}
        </div>
        <div className="section-title">Por Categoría</div>

        <div className="cat-select-wrap">
          <div
            className={`cat-select${dropdownOpen ? ' open' : ''}`}
            onClick={() => setDropdownOpen((o) => !o)}
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
                    setSelectedCat(cat)
                    setDropdownOpen(false)
                  }}
                >
                  {cat}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rows" style={{ marginTop: '14px' }}>
          {catPairs.slice(0, 5).map((p, i) => (
            <PairRow
              key={p.id}
              rank={i + 1}
              pareja={p.pareja}
              grupo={p.grupo}
              amount={p.amount}
              leader={i === 0}
              onClick={() => openModal(p)}
            />
          ))}
        </div>

        <div className="ver-todas-wrap">
          <button className="ver-todas" onClick={() => setCatModalOpen(true)}>
            Ver todas →
          </button>
        </div>
      </div>

      <footer>
        <p className="footer-copy">
          © {tournament.year} Calcuta Floü · Pedaleros
        </p>
        <div className="footer-brand">
          <a
            className="footer-link"
            href="https://instagram.com/beanbug.corp"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              className="footer-ig-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle
                cx="17.5"
                cy="6.5"
                r="0.8"
                fill="currentColor"
                stroke="none"
              />
            </svg>
            beanbug.corp
          </a>
          <img
            className="footer-logo"
            src="/beanbug-logo.png"
            alt="BeanBug Corp"
          />
          <a
            className="footer-link"
            href="https://beanbugcorp.com"
            target="_blank"
            rel="noreferrer"
          >
            beanbugcorp.com
          </a>
        </div>
      </footer>

      {searchOpen && (
        <SearchOverlay
          sortedAll={sortedAll}
          onClose={() => setSearchOpen(false)}
          onSelectPair={handleSelectFromSearch}
        />
      )}

      {catModalOpen && (
        <CategoryModal
          categoria={activeCat}
          catPairs={catPairs}
          onClose={() => setCatModalOpen(false)}
          onSelectPair={(p) => {
            setCatModalOpen(false)
            setModalPair(p)
            setModalOnBack(() => () => {
              setModalPair(null)
              setCatModalOpen(true)
            })
          }}
        />
      )}

      {modalPair && (
        <PairModal pair={modalPair} onClose={closeModal} onBack={modalOnBack} />
      )}
    </div>
  )
}
