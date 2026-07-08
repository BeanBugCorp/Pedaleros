import { useState } from 'react'
import { useSortedPairs } from '../../../hooks/useGuestData'
import { useDeletePair } from '../../../hooks/useAdminData'
import './DeletePairPanel.css'

// Search bar + single-selection list to find and delete one pair. The
// delete button requires a double click so a stray click can't remove data.
export function DeletePairPanel({ eventId, onDeleted }) {
  const { sortedPairs, reloadSortedPairs } = useSortedPairs(eventId)
  const { deletePair, loading: deleting } = useDeletePair()
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [error, setError] = useState('')

  // All event pairs are loaded once; filtering happens in memory.
  const q = query.trim().toLowerCase()
  const results = q
    ? sortedPairs.filter((p) =>
        p.players.some((name) => name.toLowerCase().includes(q)),
      )
    : []

  const handleConfirmedDelete = async () => {
    if (!selectedId || deleting) return
    setError('')
    const { error: deleteError } = await deletePair(selectedId)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    setSelectedId('')
    reloadSortedPairs()
    onDeleted?.(selectedId)
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
                  {p.players[0]} / {p.players[1]}
                  {p.categoria ? ` — ${p.categoria}` : ''}
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
