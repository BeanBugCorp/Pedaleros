import { useEffect, useState } from 'react'
import { useCategories } from '../../../hooks/useGuestData'
import {
  useGroupLabelsForCategory,
  useAddPair,
} from '../../../hooks/useAdminData'
import './AddPairForm.css'

const FALLBACK_GROUP = 'Único'

// Row of 5 fields + a "+" button to add a single pair to an existing event.
export function AddPairForm({ eventId, onAdded }) {
  const { categories, error: categoriesError } = useCategories(eventId)
  const [gender, setGender] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [player1, setPlayer1] = useState('')
  const [player2, setPlayer2] = useState('')
  const [groupLabel, setGroupLabel] = useState(FALLBACK_GROUP)
  const [error, setError] = useState('')

  const { addPair, loading: saving } = useAddPair()
  const { groupLabels, error: groupLabelsError } =
    useGroupLabelsForCategory(categoryId)
  const groupOptions = groupLabels.length ? groupLabels : [FALLBACK_GROUP]

  // Keep the selected group valid as the options change (category switch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync selection to options
    setGroupLabel(groupOptions[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps -- groupOptions is derived from groupLabels
  }, [categoryId, groupLabels])

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
    const { data, error: addError } = await addPair({
      eventId,
      categoryId,
      player1: player1.trim(),
      player2: player2.trim(),
      groupLabel,
    })
    if (addError) {
      setError(addError.message)
    } else {
      setPlayer1('')
      setPlayer2('')
      onAdded?.(data)
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

      {(error || categoriesError || groupLabelsError) && (
        <p className="add-pair-error">
          {error || (categoriesError ?? groupLabelsError).message}
        </p>
      )}
    </form>
  )
}
