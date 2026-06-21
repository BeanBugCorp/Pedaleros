import { useState } from 'react'
import { tournament, categories, pairs } from '../../data/content'
import './GuestPage.css'

const fmt = (n) => '$' + Number(n).toLocaleString('en-US')

const BallLines = () => (
  <svg viewBox="0 0 34 34" aria-hidden="true">
    <path d="M2,12 Q17,1 32,12" fill="none" stroke="white" strokeWidth="1.6" strokeOpacity="0.85" />
    <path d="M2,22 Q17,33 32,22" fill="none" stroke="white" strokeWidth="1.6" strokeOpacity="0.85" />
  </svg>
)

function PairRow({ rank, pareja, categoria, grupo, amount, leader }) {
  return (
    <div className={`row${leader ? ' leader' : ''}`}>
      <div className="rank-ball">
        <BallLines />
        <span className="num">{rank}</span>
      </div>
      <div className="row-main">
        <div className="pareja">{pareja}</div>
        <div className="grupo">{categoria ? `${categoria} · ${grupo}` : grupo}</div>
      </div>
      <div className="amount">{fmt(amount)}</div>
    </div>
  )
}

function SearchOverlay({ onClose, sortedAll }) {
  const [query, setQuery] = useState('')

  const q = query.toLowerCase()
  const results = query.trim()
    ? sortedAll.filter(p => p.pareja.toLowerCase().includes(q))
    : []

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-header">
          <input
            autoFocus
            type="text"
            className="search-input"
            placeholder="Buscar pareja…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className="search-close" onClick={onClose} aria-label="Cerrar">✕</button>
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
              {results.map(p => (
                <PairRow
                  key={p.id}
                  rank={sortedAll.findIndex(pp => pp.id === p.id) + 1}
                  pareja={p.pareja}
                  categoria={p.categoria}
                  grupo={p.grupo}
                  amount={p.amount}
                  leader={false}
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
  const [selectedCat, setSelectedCat] = useState(categories[0])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const sortedAll = [...pairs].sort((a, b) => b.amount - a.amount)

  const topFive = sortedAll.slice(0, 5)

  const totalPool = pairs.reduce((s, p) => s + p.amount, 0)
  const maxWin = sortedAll[0]?.amount ?? 0

  const catPairs = pairs
    .filter(p => p.categoria === selectedCat)
    .sort((a, b) => b.amount - a.amount)

  return (
    <div className="page">
      <header>
        <div className="header-text">
          <h1 className="torneo-name">{tournament.name}</h1>
          <div className="header-meta">
            <span>{tournament.club}</span>
            <span className="dates">{tournament.dates}</span>
          </div>
        </div>
        <button className="search-btn" onClick={() => setSearchOpen(true)} aria-label="Buscar pareja">
          ⌕
        </button>
      </header>

      <div className="tote">
        <div className="tote-stat">
          <div className="tote-label">Pozo Total</div>
          <div className="tote-value">{fmt(totalPool)}</div>
        </div>
        <div className="tote-stat">
          <div className="tote-label">Max Ganancia</div>
          <div className="tote-value">{fmt(maxWin)}</div>
        </div>
        <div className="tote-stat">
          <div className="tote-label"># Parejas</div>
          <div className="tote-value">{pairs.length}</div>
        </div>
      </div>

      <div className="section-title">Top 5 Global</div>
      <div className="rows">
        {topFive.map((p, i) => (
          <PairRow
            key={p.id}
            rank={i + 1}
            pareja={p.pareja}
            categoria={p.categoria}
            grupo={p.grupo}
            amount={p.amount}
            leader={i === 0}
          />
        ))}
      </div>

      <div className="section-title">Por Categoría</div>

      <div
        className={`cat-select${dropdownOpen ? ' open' : ''}`}
        onClick={() => setDropdownOpen(o => !o)}
      >
        <span className="label">{selectedCat}</span>
        <span className="chevron">▾</span>
      </div>
      <div className={`cat-menu${dropdownOpen ? ' open' : ''}`}>
        <div className="cat-menu-inner">
          {categories.map(cat => (
            <div
              key={cat}
              className="cat-option"
              onClick={e => {
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

      <div className="rows" style={{ marginTop: '14px' }}>
        {catPairs.map((p, i) => (
          <PairRow
            key={p.id}
            rank={i + 1}
            pareja={p.pareja}
            grupo={p.grupo}
            amount={p.amount}
            leader={i === 0}
          />
        ))}
      </div>

      <div className="ver-todas-wrap">
        <button className="ver-todas">Ver todas →</button>
      </div>

      <footer>
        <p>{tournament.contact} · © {tournament.year} Calcuta Pádel</p>
      </footer>

      {searchOpen && (
        <SearchOverlay
          sortedAll={sortedAll}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </div>
  )
}
