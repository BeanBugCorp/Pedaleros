import { useState } from 'react'
import { FileImport } from './FileImport'
import './ImportData.css'
import { parseImportFile } from '../../../lib/importParser'
import { pushImportToDatabase } from '../../../lib/importToDatabase'
import { useAuth } from '../../../hooks/useAuth'

// Self-contained admin import flow: pick a file, parse it, name the event,
// and push categories + pairs into the database with a per-row summary.
export function ImportData() {
  const { user } = useAuth()
  const [file, setFile] = useState(null)
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('')
  const [pushing, setPushing] = useState(false)
  const [summary, setSummary] = useState(null)
  const [eventName, setEventName] = useState('')

  const handleFileSelected = (f) => {
    setFile(f)
    setData(null)
    setStatus('')
    setSummary(null)
  }

  const handleLoad = async () => {
    if (!file) return
    setStatus('Loading…')
    try {
      const parsed = await parseImportFile(file)
      setData(parsed)
      setStatus(
        `Loaded ${parsed.categories.length} categories and ${parsed.pairs.length} pairs.`,
      )
    } catch (err) {
      setData(null)
      setStatus(`Error: ${err.message}`)
    }
  }

  const handlePush = async () => {
    if (!data) return
    if (!user) {
      setStatus('You must be signed in to push to the database.')
      return
    }
    if (!eventName.trim()) {
      setStatus('Please enter an event name.')
      return
    }
    setPushing(true)
    setStatus('Pushing to database…')
    setSummary(null)
    try {
      const ext = file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase()
      const result = await pushImportToDatabase({
        data,
        eventName: eventName.trim(),
        ownerId: user.id,
        filename: file.name,
        fileType: ext,
      })
      setSummary(result)
      setStatus('')
    } catch (err) {
      setStatus(`Error pushing to database: ${err.message}`)
    } finally {
      setPushing(false)
    }
  }

  return (
    <div>
      <h2>Create new event from file</h2>
      <div style={{ marginTop: 16 }}>
        <label
          htmlFor="event-name"
          style={{ display: 'block', marginBottom: 4 }}
        >
          Event name
        </label>
        <input
          id="event-name"
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="Event Name"
          className="search-input"
          style={{ width: '100%' }}
        />
      </div>
      <FileImport onFileSelected={handleFileSelected} />
      <div className="import-actions">
        <button
          type="button"
          className="import-btn"
          onClick={handleLoad}
          disabled={!file}
        >
          Load file content
        </button>
        <button
          type="button"
          className="import-btn"
          onClick={handlePush}
          disabled={!data || pushing}
        >
          Push to database
        </button>
      </div>
      {status && <p>{status}</p>}
      {summary && <ImportSummary summary={summary} />}
    </div>
  )
}

function ImportSummary({ summary }) {
  return (
    <div
      style={{
        marginTop: 16,
        padding: 12,
        background: '#f5f5f5',
        borderRadius: 6,
        color: 'black',
      }}
    >
      <h3 style={{ marginTop: 0 }}>Import summary</h3>
      <p>
        Event: <strong>{summary.eventName}</strong>
        <br />
        Categories imported: {summary.categories}
        <br />
        Pairs imported: {summary.pairs.imported} / {summary.pairs.total}
        <br />
        Pairs failed: {summary.pairs.failed}
      </p>
      {summary.failures.length > 0 && (
        <>
          <h4 style={{ marginBottom: 4 }}>Failed pairs</h4>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {summary.failures.map((f, i) => (
              <li key={i} style={{ marginBottom: 4 }}>
                <strong>
                  {f.player1 || '—'} / {f.player2 || '—'}
                </strong>
                {f.team_name ? ` (${f.team_name})` : ''}
                {f.category_name ? ` — ${f.category_name}` : ''}
                <br />
                <span style={{ color: '#c0392b' }}>{f.reason}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
