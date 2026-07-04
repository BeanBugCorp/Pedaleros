import { useEffect, useState } from 'react'
import { deletePairById, searchPairsByName } from '../../../lib/pairAdmin'
import './DeletePairPanel.css'

// Search bar + single-selection list to find and delete one pair. The
// delete button requires a double click so a stray click can't remove data.
export function DeletePairPanel({ eventId, onDeleted }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!eventId || !query.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clear stale results
      setResults([])
      return
    }
    let cancelled = false
    searchPairsByName(eventId, query.trim())
      .then((rows) => {
        if (!cancelled) setResults(rows)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [eventId, query])

  const handleConfirmedDelete = async () => {
    if (!selectedId || deleting) return
    setDeleting(true)
    setError('')
    try {
      await deletePairById(selectedId)
      setResults((prev) => prev.filter((p) => p.id !== selectedId))
      setSelectedId('')
      onDeleted?.(selectedId)
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="delete-pair-panel">
      <input
        className="search-input delete-pair-search"
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setSelectedId('')
        }}
        placeholder="Buscar por jugador 1 o jugador 2…"
      />

      {results.length > 0 && (
        <ul className="delete-pair-results">
          {results.map((p) => (
            <li key={p.id}>
              <label className="delete-pair-result">
                <input
                  type="radio"
                  name="delete-pair-selection"
                  checked={selectedId === p.id}
                  onChange={() => setSelectedId(p.id)}
                />
                <span>
                  {p.player1} / {p.player2}
                  {p.categoryName ? ` — ${p.categoryName}` : ''}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {query.trim() && results.length === 0 && (
        <p className="delete-pair-empty">Sin resultados.</p>
      )}

      <div className="delete-pair-actions">
        <button
          type="button"
          className="delete-pair-btn"
          onDoubleClick={handleConfirmedDelete}
          disabled={!selectedId || deleting}
          title="Doble clic para eliminar"
        >
          {deleting ? 'Eliminando…' : 'Eliminar (doble clic)'}
        </button>
      </div>

      {error && <p className="add-pair-error">{error}</p>}
    </div>
  )
}
