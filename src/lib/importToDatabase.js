import { supabase } from './supabaseClient'

// Pushes parsed import data ({ categories, pairs }) into Supabase under a
// single event. Creates the event, its categories, then the pairs (linking
// each pair to its category by name), and records an import_log row.
export async function pushImportToDatabase({
  data,
  eventName,
  ownerId,
  filename,
  fileType,
}) {
  // 1. Create the event.
  const { data: event, error: eventError } = await supabase
    .from('event')
    .insert({ name: eventName, owner: ownerId })
    .select()
    .single()
  if (eventError) throw eventError

  // 2. Insert categories tied to the event.
  const categoryRows = data.categories.map((c) => ({
    name: c.name,
    gender: c.gender,
    sort_order: c.sort_order,
    event_id: event.id,
  }))

  const { data: insertedCategories, error: categoriesError } = await supabase
    .from('categories')
    .insert(categoryRows)
    .select()
  if (categoriesError) throw categoriesError

  // Map category name -> id so pairs can reference them.
  const categoryIdByName = new Map(
    insertedCategories.map((c) => [c.name, c.id]),
  )

  // 3. Build pair rows, resolving category_name -> category_id. Locally
  // validate required fields so obviously-bad rows are reported clearly
  // instead of blowing up a whole batch insert.
  const candidates = []
  const failures = []
  for (const p of data.pairs) {
    const categoryId = categoryIdByName.get(p.category_name)
    const reason = describePairProblem(p, categoryId)
    if (reason) {
      failures.push({ pair: p, reason })
      continue
    }
    candidates.push({
      source: p,
      row: {
        category_id: categoryId,
        event_id: event.id,
        player1: p.player1,
        player2: p.player2,
        team_name: p.team_name,
        photo_url_1: p.photo_1,
        photo_url_2: p.photo_2,
        group_label: p.group_label,
        sort_order: p.sort_order,
      },
    })
  }

  // Insert the valid candidates, continuing past any the DB still rejects
  // (e.g. NOT NULL constraints we didn't validate for locally).
  const imported = await insertPairsResilient(candidates, failures)

  const totalRecords = data.categories.length + data.pairs.length
  const importedRecords = categoryRows.length + imported

  // 4. Record the import in import_log.
  const { error: logError } = await supabase.from('import_log').insert({
    filename,
    file_type: fileType,
    total_records: totalRecords,
    imported_records: importedRecords,
    skipped_records: failures.length,
    notes:
      `Imported into event "${eventName}" (${event.id}). ` +
      `${imported}/${data.pairs.length} pairs imported, ` +
      `${failures.length} failed.`,
  })
  if (logError) throw logError

  return {
    eventId: event.id,
    eventName,
    categories: categoryRows.length,
    pairs: {
      total: data.pairs.length,
      imported,
      failed: failures.length,
    },
    failures: failures.map((f) => ({
      category_name: f.pair.category_name,
      player1: f.pair.player1,
      player2: f.pair.player2,
      team_name: f.pair.team_name,
      reason: f.reason,
    })),
  }
}

// Returns a human-readable reason a pair can't be imported, or null if it
// looks valid. Mirrors the NOT NULL columns on the `pair` table.
function describePairProblem(pair, categoryId) {
  const missing = []
  if (!categoryId) {
    return pair.category_name
      ? `category "${pair.category_name}" not found`
      : 'missing category_name'
  }
  if (!pair.player1) missing.push('player1')
  if (!pair.player2) missing.push('player2')
  return missing.length
    ? `missing required field(s): ${missing.join(', ')}`
    : null
}

// Inserts valid pair rows. Tries a single batch insert first; if that fails,
// falls back to inserting one row at a time so a single bad row doesn't drop
// the whole import. Pushes any rejected rows into `failures`.
async function insertPairsResilient(candidates, failures) {
  if (candidates.length === 0) return 0

  const rows = candidates.map((c) => c.row)
  const { error } = await supabase.from('pair').insert(rows)
  if (!error) return candidates.length

  // Batch failed — isolate the offenders row by row.
  let imported = 0
  for (const candidate of candidates) {
    const { error: rowError } = await supabase
      .from('pair')
      .insert(candidate.row)
    if (rowError) {
      failures.push({ pair: candidate.source, reason: rowError.message })
    } else {
      imported += 1
    }
  }
  return imported
}
