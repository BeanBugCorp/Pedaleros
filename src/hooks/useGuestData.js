import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// Loads the sales summary for an event: total sales, max sale amount and the
// number of pairs. Backed by the `event_sales_summary` Postgres function so the
// aggregation runs in one query server-side (see migration note below).
export function useEventSalesSummary(eventId) {
  const [summary, setSummary] = useState({
    totalSales: 0,
    maxSale: 0,
    numPairs: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const reloadSalesSummary = useCallback(async () => {
    if (!eventId) return

    setLoading(true)
    setError(null)
    try {
      const { data, error: rpcError } = await supabase
        .rpc('event_sales_summary', { p_event_id: eventId })
        .single()

      if (rpcError) throw rpcError

      setSummary({
        totalSales: data?.total_sales ?? 0,
        maxSale: data?.max_sale ?? 0,
        numPairs: data?.num_pairs ?? 0,
      })
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount
    reloadSalesSummary()
  }, [reloadSalesSummary])

  return { ...summary, loading, error, reloadSalesSummary }
}

// Maps a row from get_top_pairs_by_event into the shape the guest UI expects.
function toUiPair(row) {
  return {
    id: row.id,
    pareja: `${row.player1} / ${row.player2}`,
    categoria: row.categoria,
    grupo: row.grupo,
    amount: row.amount,
    players: [row.player1, row.player2],
    photos: [row.photo_url_1, row.photo_url_2],
    // Carried through for edit_pair; present only if the RPC selects them.
    teamName: row.team_name ?? null,
    status: row.status ?? null,
  }
}

// Loads all of an event's pairs sorted by sale amount (desc), via the
// get_sorted_pairs_by_event Postgres function, shaped for the guest views.
export function useSortedPairs(eventId) {
  const [sortedPairs, setSortedPairs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const reloadSortedPairs = useCallback(async () => {
    if (!eventId) return

    setLoading(true)
    setError(null)
    try {
      const { data, error: rpcError } = await supabase.rpc(
        'get_sorted_pairs_by_event',
        { p_event_id: eventId },
      )

      if (rpcError) throw rpcError

      setSortedPairs((data ?? []).map(toUiPair))
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount
    reloadSortedPairs()
  }, [reloadSortedPairs])

  return { sortedPairs, loading, error, reloadSortedPairs }
}

// Loads the categories for an event via the get_categories Postgres function.
// Returns an array of { name, gender, sort_order } objects, ordered by
// sort_order ascending (nulls last).
export function useCategories(eventId) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const reloadCategories = useCallback(async () => {
    if (!eventId) return

    setLoading(true)
    setError(null)
    try {
      const { data, error: rpcError } = await supabase.rpc(
        'get_categories',
        { p_event_id: eventId },
      )

      if (rpcError) throw rpcError

      setCategories(
        (data ?? [])
          .map((row) => ({
            name: row.name,
            gender: row.gender,
            sort_order: row.sort_order,
          }))
          // Order by sort_order asc; nulls last. Both the guest dropdown and
          // the auction engine consume this order directly.
          .sort(
            (a, b) => (a.sort_order ?? Infinity) - (b.sort_order ?? Infinity),
          ),
      )
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount
    reloadCategories()
  }, [reloadCategories])

  return { categories, loading, error, reloadCategories }
}
