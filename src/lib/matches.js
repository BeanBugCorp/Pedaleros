import { supabase } from './supabaseClient'

// Example data-access layer. Adjust table/column names to your schema.
// Pair these with Row Level Security policies in Supabase so the anon key
// can only read/write what each user is allowed to.

export async function listMatches() {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createMatch(match) {
  const { data, error } = await supabase
    .from('matches')
    .insert(match)
    .select()
    .single()

  if (error) throw error
  return data
}
