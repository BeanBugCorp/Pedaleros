import { useState } from 'react'
import { AuthTester } from '../../components/AuthTester'
import { FileImport } from '../../components/FileImport'
import { parseImportFile } from '../../lib/importParser'
import { pushImportToDatabase } from '../../lib/importToDatabase'
import { useAuth } from '../../hooks/useAuth'

export default function AdminPage() {
  const { user } = useAuth()
  const [file, setFile] = useState(null)
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('')
  const [pushing, setPushing] = useState(false)
  const [summary, setSummary] = useState(null)
  const [eventName, setEventName] = useState('')

  const handleLoad = async () => {
    if (!file) return
    setStatus('Loading…')
    try {
      const parsed = await parseImportFile(file)
      setData(parsed)
      setStatus(
        `Loaded ${parsed.categories.length} categories and ${parsed.pairs.length} pairs.`,
      )
      console.log('Imported data:', parsed)
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
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 24px' }}>
      <AuthTester />
      <h2>Create new event from file</h2>
        <div style={{ marginTop: 16 }}>
        <label htmlFor="event-name" style={{ display: 'block', marginBottom: 4 }}>
          Event name
        </label>
        <input
          id="event-name"
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="Event name"
          style={{ width: '100%', padding: '6px 8px', boxSizing: 'border-box' }}
        />
      </div>
      <FileImport
        onFileSelected={(f) => {
          setFile(f)
          setData(null)
          setStatus('')
          setSummary(null)
        }}
      />
      <button type="button" onClick={handleLoad} disabled={!file}>
        Load file content
      </button>
      <button
        type="button"
        onClick={handlePush}
        disabled={!data || pushing}
        style={{ marginTop: 8 }}
      >
        Push to database
      </button>
      {status && <p>{status}</p>}
      {summary && (
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
      )}
      {/*data && (
        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: '#f5f5f5',
            borderRadius: 6,
            overflowX: 'auto',
            fontSize: 12,
            color: 'black',
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      )*/}
    </div>
  )
}
