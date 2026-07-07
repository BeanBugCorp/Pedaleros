import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// Distinct group labels already in use within a category, via the
// get_group_labels_for_category Postgres function. Returns an array of strings.
export function useGroupLabelsForCategory(categoryId) {
  const [groupLabels, setGroupLabels] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const reloadGroupLabels = useCallback(async () => {
    if (!categoryId) {
      setGroupLabels([])
      return
    }

    setLoading(true)
    setError(null)
    try {
      const { data, error: rpcError } = await supabase.rpc(
        'get_group_labels_for_category',
        { p_category_id: categoryId },
      )

      if (rpcError) throw rpcError

      setGroupLabels((data ?? []).map((row) => row.group_label))
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [categoryId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-change
    reloadGroupLabels()
  }, [reloadGroupLabels])

  return { groupLabels, loading, error, reloadGroupLabels }
}

// Mutation hook that inserts a single pair via the add_pair Postgres function.
// Returns { addPair, loading, error }; addPair returns { data, error } and
// never throws.
export function useAddPair() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const addPair = useCallback(
    async ({ eventId, categoryId, player1, player2, groupLabel }) => {
      setLoading(true)
      setError(null)
      try {
        const { data, error: rpcError } = await supabase
          .rpc('add_pair', {
            p_event_id: eventId,
            p_category_id: categoryId,
            p_player1: player1,
            p_player2: player2,
            p_group_label: groupLabel,
          })
          .single()
        if (rpcError) throw rpcError
        return { data, error: null }
      } catch (err) {
        setError(err)
        return { data: null, error: err }
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  return { addPair, loading, error }
}

// Mutation hook that deletes a single pair via the delete_pair Postgres
// function. Returns { deletePair, loading, error }; deletePair returns
// { error } and never throws.
export function useDeletePair() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const deletePair = useCallback(async (pairId) => {
    setLoading(true)
    setError(null)
    try {
      const { error: rpcError } = await supabase.rpc('delete_pair', {
        p_pair_id: pairId,
      })
      if (rpcError) throw rpcError
      return { error: null }
    } catch (err) {
      setError(err)
      return { error: err }
    } finally {
      setLoading(false)
    }
  }, [])

  return { deletePair, loading, error }
}
