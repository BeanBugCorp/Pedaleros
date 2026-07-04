import { useEffect, useState } from 'react'
import {
  addPair,
  fetchCategoriesForEvent,
  fetchGroupLabelsForCategory,
} from '../../../lib/pairAdmin'
import './AddPairForm.css'

const FALLBACK_GROUP = 'Único'

// Row of 5 fields + a "+" button to add a single pair to an existing event.
export function AddPairForm({ eventId, onAdded }) {
  const [categories, setCategories] = useState([])
  const [gender, setGender] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [player1, setPlayer1] = useState('')
  const [player2, setPlayer2] = useState('')
  const [groupOptions, setGroupOptions] = useState([FALLBACK_GROUP])
  const [groupLabel, setGroupLabel] = useState(FALLBACK_GROUP)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!eventId) return
    let cancelled = false
    fetchCategoriesForEvent(eventId)
      .then((rows) => {
        if (!cancelled) setCategories(rows)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [eventId])

  useEffect(() => {
    if (!categoryId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset when category cleared
      setGroupOptions([FALLBACK_GROUP])
      setGroupLabel(FALLBACK_GROUP)
      return
    }
    let cancelled = false
    fetchGroupLabelsForCategory(categoryId)
      .then((labels) => {
        if (cancelled) return
        const options = labels.length ? labels : [FALLBACK_GROUP]
        setGroupOptions(options)
        setGroupLabel(options[0])
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [categoryId])

  const genders = [...new Set(categories.map((c) => c.gender).filter(Boolean))]
  const filteredCategories = gender
    ? categories.filter((c) => c.gender === gender)
    : categories

  const handleGenderChange = (value) => {
    setGender(value)
    setCategoryId('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!categoryId || !player1.trim() || !player2.trim()) {
      setError('Completa categoría, jugador 1 y jugador 2.')
      return
    }
    setSaving(true)
    try {
      const pair = await addPair({
        eventId,
        categoryId,
        player1: player1.trim(),
        player2: player2.trim(),
        groupLabel,
      })
      setPlayer1('')
      setPlayer2('')
      onAdded?.(pair)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="add-pair-form" onSubmit={handleSubmit}>
      <div className="add-pair-fields">
        <select
          className="add-pair-select"
          value={gender}
          onChange={(e) => handleGenderChange(e.target.value)}
          aria-label="Género"
        >
          <option value="">Género</option>
          {genders.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select
          className="add-pair-select"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          aria-label="Categoría"
        >
          <option value="">Categoría</option>
          {filteredCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          className="add-pair-input"
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
          placeholder="Jugador 1"
        />

        <input
          className="add-pair-input"
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
          placeholder="Jugador 2"
        />

        <select
          className="add-pair-select"
          value={groupLabel}
          onChange={(e) => setGroupLabel(e.target.value)}
          aria-label="Grupo"
        >
          {groupOptions.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <button type="submit" className="add-pair-submit" disabled={saving}>
          {saving ? '…' : 'Add'}
        </button>
      </div>

      {error && <p className="add-pair-error">{error}</p>}
    </form>
  )
}
