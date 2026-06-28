import { useState } from 'react'
import PairRow from '../PairRow/PairRow'
import './SearchOverlay.css'

export default function SearchOverlay({ onClose, sortedAll, onSelectPair }) {
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
