import { useState, useEffect } from 'react'
import './SetlistSelector.css'

function SetlistSelector({ onSelect, onEditMode }) {
  const [setlists, setSetlists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadSetlists()
  }, [])

  const loadSetlists = async () => {
    try {
      setLoading(true)
      // Load all setlists (no date filtering)
      const response = await fetch('/api/setlists')

      if (!response.ok) {
        throw new Error('Failed to load setlists')
      }

      const data = await response.json()
      setSetlists(data)
      setError(null)
    } catch (err) {
      console.error('Error loading setlists:', err)
      setError('No se pudieron cargar los setlists')
    } finally {
      setLoading(false)
    }
  }

  const handleSetlistClick = async (setlist) => {
    try {
      // Load full setlist with songs
      const response = await fetch(`/api/setlists/${setlist.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to load setlist details')
      }

      const fullSetlist = await response.json()
      onSelect(fullSetlist)
    } catch (err) {
      console.error('Error loading setlist:', err)
      alert('Error al cargar el setlist')
    }
  }

  if (loading) {
    return (
      <div className="setlist-selector">
        <div className="loading">Cargando...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="setlist-selector">
        <div className="error">{error}</div>
        <button className="retry-btn" onClick={loadSetlists}>
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="setlist-selector">
      <div className="selector-header">
        <h1 className="app-title">◢ LIVE CONTROL ◣</h1>
        <p className="app-subtitle">AMPLITUBE MIDI SYSTEM</p>
      </div>

      <div className="setlists-container">
        <h2 className="section-title">▸ SELECT SETLIST</h2>
        
        {setlists.length === 0 ? (
          <div className="empty-state">
            <p>NO SETLISTS AVAILABLE</p>
            <button className="edit-btn" onClick={onEditMode}>
              + CREATE SETLIST
            </button>
          </div>
        ) : (
          <div className="setlists-grid">
            {setlists.map((setlist) => {
              const eventDate = setlist.eventDate ? new Date(setlist.eventDate) : null;
              const formattedDate = eventDate ? eventDate.toLocaleDateString('es-ES', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
              }).toUpperCase() : '';

              return (
                <button
                  key={setlist.id}
                  className="setlist-card"
                  onClick={() => handleSetlistClick(setlist)}
                >
                  <div className="setlist-icon">▶</div>
                  <div className="setlist-name">{setlist.name}</div>
                  {formattedDate && (
                    <div className="setlist-date">{formattedDate}</div>
                  )}
                  <div className="setlist-count">
                    {setlist.songs.length} TRACKS
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="selector-footer">
        <button className="edit-mode-btn" onClick={onEditMode}>
          ⚡ EDIT MODE
        </button>
      </div>
    </div>
  )
}

export default SetlistSelector

