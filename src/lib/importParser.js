import * as XLSX from 'xlsx'

// Parses an imported file (.xlsx or .xml) into the canonical shape:
// { categories: [...], pairs: [...] }
export async function parseImportFile(file) {
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
  if (ext === '.xlsx') return parseXlsx(file)
  if (ext === '.xml') return parseXml(file)
  throw new Error('Unsupported file type. Expected .xml or .xlsx.')
}

function toNumberOrNull(value) {
  if (value === undefined || value === null || value === '') return null
  const n = Number(value)
  return Number.isNaN(n) ? null : n
}

function toStringOrNull(value) {
  if (value === undefined || value === null) return null
  const s = String(value).trim()
  return s === '' ? null : s
}

function normalizeCategory(row) {
  return {
    name: toStringOrNull(row.name),
    gender: toStringOrNull(row.gender),
    sort_order: toNumberOrNull(row.sort_order),
  }
}

function normalizePair(row) {
  return {
    category_name: toStringOrNull(row.category_name),
    player1: toStringOrNull(row.player1),
    player2: toStringOrNull(row.player2),
    team_name: toStringOrNull(row.team_name),
    group_label: toStringOrNull(row.group_label),
    sort_order: toNumberOrNull(row.sort_order),
    photo_1: toStringOrNull(row.photo_1),
    photo_2: toStringOrNull(row.photo_2),
  }
}

async function parseXlsx(file) {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })

  const readSheet = (name) => {
    const sheetName = workbook.SheetNames.find(
      (s) => s.toLowerCase() === name.toLowerCase(),
    )
    const sheet = sheetName ? workbook.Sheets[sheetName] : null
    if (!sheet) return []
    return XLSX.utils.sheet_to_json(sheet, { defval: null })
  }

  return {
    categories: readSheet('categories').map(normalizeCategory),
    pairs: readSheet('pairs').map(normalizePair),
  }
}

async function parseXml(file) {
  const text = await file.text()
  const doc = new DOMParser().parseFromString(text, 'application/xml')

  const parseError = doc.querySelector('parsererror')
  if (parseError) throw new Error('Invalid XML file.')

  // Supports both attribute-based and child-element-based nodes.
  const readNode = (node, fields) => {
    const out = {}
    for (const field of fields) {
      const attr = node.getAttribute(field)
      if (attr !== null) {
        out[field] = attr
      } else {
        const child = node.querySelector(field)
        out[field] = child ? child.textContent : null
      }
    }
    return out
  }

  const categoryFields = ['name', 'gender', 'sort_order']
  const pairFields = [
    'category_name',
    'player1',
    'player2',
    'team_name',
    'group_label',
    'sort_order',
    'photo_1',
    'photo_2',
  ]

  const categories = Array.from(doc.querySelectorAll('categories > category'))
    .map((node) => readNode(node, categoryFields))
    .map(normalizeCategory)

  const pairs = Array.from(doc.querySelectorAll('pairs > pair'))
    .map((node) => readNode(node, pairFields))
    .map(normalizePair)

  return { categories, pairs }
}
