import { useRef, useState } from 'react'
import './FileImport.css'

const ACCEPTED = {
  '.xml': 'application/xml',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

const ACCEPT_ATTR = '.xml,.xlsx'

function getExtension(name) {
  const dot = name.lastIndexOf('.')
  return dot === -1 ? '' : name.slice(dot).toLowerCase()
}

// File import control restricted to XML and XLSX files. Hands the validated
// File up to the parent through onFileSelected.
export function FileImport({ onFileSelected }) {
  const inputRef = useRef(null)
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')

  const handleFiles = (files) => {
    const file = files?.[0]
    if (!file) return

    const ext = getExtension(file.name)
    if (!ACCEPTED[ext]) {
      setError('Unsupported file. Please choose an .xml or .xlsx file.')
      setFileName('')
      return
    }

    setError('')
    setFileName(file.name)
    onFileSelected?.(file)
  }

  const handleChange = (e) => handleFiles(e.target.files)

  const handleDrop = (e) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="file-import">
      <div
        className="file-import__dropzone"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
      >
        <p>Drop an XML or XLSX file here, or click to browse.</p>
        {fileName && <p className="file-import__name">Selected: {fileName}</p>}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </div>
      {error && <p className="file-import__error">{error}</p>}
    </div>
  )
}
