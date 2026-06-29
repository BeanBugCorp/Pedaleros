import { useCallback, useMemo, useState } from 'react'
import { useSortedPairs, useCategories } from './useGuestData'
import { supabase } from '../lib/supabaseClient'
import { buildTournamentData } from '../lib/buildTournamentData'

// Provider hook for the auction view. Pulls an event's categories and pairs
// and reshapes them into the nested tournament structure the auction engine
// (Hub / LiveAuction / Edit) consumes.
export function useAuctionData(eventId) {
  const {
    sortedPairs,
    loading: pairsLoading,
    error: pairsError,
    reloadSortedPairs,
  } = useSortedPairs(eventId)
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    reloadCategories,
  } = useCategories(eventId)

  const data = useMemo(
    () => buildTournamentData(categories, sortedPairs),
    [categories, sortedPairs],
  )

  const reload = () => {
    reloadSortedPairs()
    reloadCategories()
  }

  return {
    data,
    loading: pairsLoading || categoriesLoading,
    error: pairsError || categoriesError,
    reload,
  }
}

// Mutation hook that persists a full pair update via the edit_pair Postgres
// function. Field names are mapped to the function's p_* parameters.
// Returns { editPair, loading, error }; editPair returns { error } and never throws.
export function useEditPair() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const editPair = useCallback(async (pair) => {
    setLoading(true)
    setError(null)
    try {
      const { error: rpcError } = await supabase.rpc('edit_pair', {
        p_pair_id: pair.id,
        p_player1: pair.player1 ?? null,
        p_player2: pair.player2 ?? null,
        p_team_name: pair.teamName ?? null,
        p_photo_url_1: pair.photoUrl1 ?? null,
        p_photo_url_2: pair.photoUrl2 ?? null,
        p_group_label: pair.groupLabel ?? null,
        p_status: pair.status ?? null,
        p_sale_amount: pair.saleAmount ?? null,
        p_group: pair.group ?? null,
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

  return { editPair, loading, error }
}
