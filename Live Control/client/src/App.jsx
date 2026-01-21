import { useState, useEffect } from 'react'
import LiveMode from './components/LiveMode'
import EditMode from './components/EditMode'
import SetlistSelector from './components/SetlistSelector'
import './App.css'

function App() {
  const [mode, setMode] = useState('select') // 'select', 'live', 'edit'
  const [selectedSetlist, setSelectedSetlist] = useState(null)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'
  })

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const handleSetlistSelect = (setlist) => {
    setSelectedSetlist(setlist)
    setMode('live')
  }

  const handleBackToSelect = () => {
    setMode('select')
    setSelectedSetlist(null)
  }

  const handleEditMode = () => {
    setMode('edit')
  }

  const handleThemeToggle = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="app">
      {mode === 'select' && (
        <SetlistSelector
          onSelect={handleSetlistSelect}
          onEditMode={handleEditMode}
        />
      )}

      {mode === 'live' && selectedSetlist && (
        <LiveMode
          setlist={selectedSetlist}
          onBack={handleBackToSelect}
        />
      )}

      {mode === 'edit' && (
        <EditMode
          onBack={handleBackToSelect}
          theme={theme}
          onThemeToggle={handleThemeToggle}
        />
      )}
    </div>
  )
}

export default App

