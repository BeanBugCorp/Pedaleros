import { supabase } from './supabaseClient'

// Admin CRUD helpers for single pairs, used by the "add pair" / "delete pair"
// controls on the admin page once an event has been created via import.

// Categories for an event, used to populate the gender/category dropdowns.
export async function fetchCategoriesForEvent(eventId) {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, gender, sort_order')
    .eq('event_id', eventId)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data ?? []
}

// Distinct group labels already in use within a category, so the group
// dropdown offers real groups instead of free text.
export async function fetchGroupLabelsForCategory(categoryId) {
  const { data, error } = await supabase
    .from('pair')
    .select('group_label')
    .eq('category_id', categoryId)
  if (error) throw error
  const labels = new Set(
    (data ?? []).map((row) => row.group_label).filter(Boolean),
  )
  return [...labels].sort((a, b) => a.localeCompare(b))
}

// Inserts a single pair tied to an event/category.
export async function addPair({
  eventId,
  categoryId,
  player1,
  player2,
  groupLabel,
}) {
  const { data, error } = await supabase
    .from('pair')
    .insert({
      event_id: eventId,
      category_id: categoryId,
      player1,
      player2,
      group_label: groupLabel,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

// Searches an event's pairs by player1/player2, for the delete-pair picker.
export async function searchPairsByName(eventId, query) {
  const escaped = query.replace(/[%,()]/g, '')
  const { data, error } = await supabase
    .from('pair')
    .select('id, player1, player2, categories(name)')
    .eq('event_id', eventId)
    .or(`player1.ilike.%${escaped}%,player2.ilike.%${escaped}%`)
    .limit(25)
  if (error) throw error
  return (data ?? []).map((row) => ({
    id: row.id,
    player1: row.player1,
    player2: row.player2,
    categoryName: row.categories?.name ?? null,
  }))
}

// Deletes a single pair by id.
export async function deletePairById(pairId) {
  const { error } = await supabase.from('pair').delete().eq('id', pairId)
  if (error) throw error
}
