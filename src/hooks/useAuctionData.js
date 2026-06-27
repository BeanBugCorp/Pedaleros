import { useMemo } from 'react'
import { useSortedPairs, useCategories } from './useGuestData'
import { buildTournamentData } from '../features/auction/buildTournamentData'

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
