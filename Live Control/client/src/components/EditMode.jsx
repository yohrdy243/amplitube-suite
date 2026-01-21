import { useState, useEffect } from 'react'
import './EditMode.css'
import { useRealtime } from '../hooks/useRealtime'

function EditMode({ onBack, theme, onThemeToggle }) {
  const [activeTab, setActiveTab] = useState('songs') // 'songs' or 'setlists'
  const [songs, setSongs] = useState([])
  const [setlists, setSetlists] = useState([])
  const [editingSong, setEditingSong] = useState(null)
  const [editingSetlist, setEditingSetlist] = useState(null)

  // Setup real-time synchronization
  useRealtime({
    onSongCreated: (song) => {
      console.log('🔄 Recibida nueva canción:', song.name)
      setSongs(prev => {
        // Avoid duplicates
        if (prev.find(s => s.id === song.id)) return prev
        return [...prev, song]
      })
    },
    onSongUpdated: (song) => {
      console.log('🔄 Canción actualizada:', song.name)
      setSongs(prev => prev.map(s => s.id === song.id ? song : s))
    },
    onSongDeleted: (songId) => {
      console.log('🔄 Canción eliminada:', songId)
      setSongs(prev => prev.filter(s => s.id !== songId))
    },
    onSetlistCreated: (setlist) => {
      console.log('🔄 Recibido nuevo setlist:', setlist.name)
      setSetlists(prev => {
        // Avoid duplicates
        if (prev.find(sl => sl.id === setlist.id)) return prev
        return [...prev, setlist]
      })
    },
    onSetlistUpdated: (setlist) => {
      console.log('🔄 Setlist actualizado:', setlist.name)
      setSetlists(prev => prev.map(sl => sl.id === setlist.id ? setlist : sl))
    },
    onSetlistDeleted: (setlistId) => {
      console.log('🔄 Setlist eliminado:', setlistId)
      setSetlists(prev => prev.filter(sl => sl.id !== setlistId))
    },
    onSetlistsReloaded: (newSetlists) => {
      console.log('🔄 Setlists recargados')
      setSetlists(newSetlists)
    }
  })

  // Load data on mount
  useEffect(() => {
    loadSongs()
    loadSetlists()
  }, [])

  const loadSongs = async () => {
    try {
      const response = await fetch('/api/songs')
      const data = await response.json()
      setSongs(data)
    } catch (error) {
      console.error('Error loading songs:', error)
    }
  }

  const loadSetlists = async () => {
    try {
      const response = await fetch('/api/setlists')
      const data = await response.json()
      setSetlists(data)
    } catch (error) {
      console.error('Error loading setlists:', error)
    }
  }

  const handleCreateSong = () => {
    setEditingSong({
      id: `song-${Date.now()}`,
      name: '',
      programChange: 1,
      scenes: [
        { name: 'Intro', cc: 20 },
        { name: 'Verso', cc: 21 },
        { name: 'Coro', cc: 22 },
        { name: 'Final', cc: 23 }
      ],
      metadata: {
        artist: '',
        key: '',
        bpm: '',
        duration: '',
        youtubeUrl: '',
        albumArt: '',
        notes: ''
      }
    })
  }

  const handleEditSong = (song) => {
    setEditingSong({ ...song })
  }

  const handleSaveSong = async () => {
    try {
      const isNew = !songs.find(s => s.id === editingSong.id)
      const url = isNew ? '/api/songs' : `/api/songs/${editingSong.id}`
      const method = isNew ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSong)
      })

      if (response.ok) {
        // No need to reload - realtime will update automatically
        setEditingSong(null)
      }
    } catch (error) {
      console.error('Error saving song:', error)
      alert('Error al guardar la canción')
    }
  }

  const handleDeleteSong = async (songId) => {
    if (!confirm('¿Eliminar esta canción?')) return

    try {
      const response = await fetch(`/api/songs/${songId}`, { method: 'DELETE' })
      if (!response.ok) {
        throw new Error('Error al eliminar')
      }
      // No need to reload - realtime will update automatically
    } catch (error) {
      console.error('Error deleting song:', error)
      alert('Error al eliminar la canción')
    }
  }

  const handleCreateSetlist = () => {
    setEditingSetlist({
      id: `setlist-${Date.now()}`,
      name: '',
      songs: []
    })
  }

  const handleEditSetlist = (setlist) => {
    setEditingSetlist({ ...setlist })
  }

  const handleSaveSetlist = async () => {
    try {
      const isNew = !setlists.find(s => s.id === editingSetlist.id)
      const url = isNew ? '/api/setlists' : `/api/setlists/${editingSetlist.id}`
      const method = isNew ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSetlist)
      })

      if (response.ok) {
        // No need to reload - realtime will update automatically
        setEditingSetlist(null)
      }
    } catch (error) {
      console.error('Error saving setlist:', error)
      alert('Error al guardar el setlist')
    }
  }

  const handleDeleteSetlist = async (setlistId) => {
    if (!confirm('¿Eliminar este setlist?')) return

    try {
      const response = await fetch(`/api/setlists/${setlistId}`, { method: 'DELETE' })
      if (!response.ok) {
        throw new Error('Error al eliminar')
      }
      // No need to reload - realtime will update automatically
    } catch (error) {
      console.error('Error deleting setlist:', error)
      alert('Error al eliminar el setlist')
    }
  }

  return (
    <div className="edit-mode">
      <div className="edit-header">
        <button className="back-btn" onClick={onBack}>
          ◂ BACK
        </button>
        <h1>⚡ EDIT MODE</h1>
        <button className="theme-toggle" onClick={onThemeToggle}>
          {theme === 'dark' ? '◐' : '◑'}
        </button>
      </div>

      <div className="edit-tabs">
        <button
          className={`tab-btn ${activeTab === 'songs' ? 'active' : ''}`}
          onClick={() => setActiveTab('songs')}
        >
          ♪ SONGS
        </button>
        <button
          className={`tab-btn ${activeTab === 'setlists' ? 'active' : ''}`}
          onClick={() => setActiveTab('setlists')}
        >
          ▤ SETLISTS
        </button>
      </div>

      <div className="edit-content">
        {activeTab === 'songs' && !editingSong && (
          <SongsManager
            songs={songs}
            onEdit={handleEditSong}
            onDelete={handleDeleteSong}
            onCreate={handleCreateSong}
          />
        )}

        {activeTab === 'songs' && editingSong && (
          <SongEditor
            song={editingSong}
            onChange={setEditingSong}
            onSave={handleSaveSong}
            onCancel={() => setEditingSong(null)}
          />
        )}

        {activeTab === 'setlists' && !editingSetlist && (
          <SetlistsManager
            setlists={setlists}
            songs={songs}
            onEdit={handleEditSetlist}
            onDelete={handleDeleteSetlist}
            onCreate={handleCreateSetlist}
          />
        )}

        {activeTab === 'setlists' && editingSetlist && (
          <SetlistEditor
            setlist={editingSetlist}
            songs={songs}
            onChange={setEditingSetlist}
            onSave={handleSaveSetlist}
            onCancel={() => setEditingSetlist(null)}
          />
        )}
      </div>
    </div>
  )
}

// ========== SONGS MANAGER ==========
function SongsManager({ songs, onEdit, onDelete, onCreate }) {
  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Canciones ({songs.length})</h2>
        <button className="create-btn" onClick={onCreate}>
          ➕ Nueva Canción
        </button>
      </div>

      <div className="items-list">
        {songs.map(song => (
          <div key={song.id} className="item-card">
            <div className="item-info">
              <div className="item-name">{song.name}</div>
              <div className="item-details">
                Preset: {song.programChange} |
                {song.metadata?.artist && ` ${song.metadata.artist} |`}
                {song.metadata?.key && ` ${song.metadata.key}`}
              </div>
            </div>
            <div className="item-actions">
              <button className="edit-btn-small" onClick={() => onEdit(song)}>
                ✏️ Editar
              </button>
              <button className="delete-btn-small" onClick={() => onDelete(song.id)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ========== SONG EDITOR ==========
function SongEditor({ song, onChange, onSave, onCancel }) {
  const updateField = (field, value) => {
    onChange({ ...song, [field]: value })
  }

  const updateMetadata = (field, value) => {
    onChange({
      ...song,
      metadata: { ...song.metadata, [field]: value }
    })
  }

  const updateScene = (index, field, value) => {
    const newScenes = [...song.scenes]
    newScenes[index] = { ...newScenes[index], [field]: value }
    onChange({ ...song, scenes: newScenes })
  }

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h2>{song.name || 'Nueva Canción'}</h2>
        <div className="editor-actions">
          <button className="cancel-btn" onClick={onCancel}>Cancelar</button>
          <button className="save-btn" onClick={onSave}>💾 Guardar</button>
        </div>
      </div>

      <div className="editor-form">
        <div className="form-section">
          <h3>Información Básica</h3>

          <div className="form-group">
            <label>Nombre de la Canción *</label>
            <input
              type="text"
              value={song.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Ej: Cordero y León"
            />
          </div>

          <div className="form-group">
            <label>Preset de AmpliTube (1-128) *</label>
            <input
              type="number"
              min="1"
              max="128"
              value={song.programChange}
              onChange={(e) => updateField('programChange', parseInt(e.target.value))}
            />
            <small>Número del preset en AmpliTube (1 = primer preset, 2 = segundo preset, etc.)</small>
          </div>
        </div>

        <div className="form-section">
          <h3>Escenas (4 requeridas)</h3>
          <div className="scenes-editor">
            {song.scenes.map((scene, index) => (
              <div key={index} className="scene-editor">
                <div className="scene-number">{index + 1}</div>
                <input
                  type="text"
                  value={scene.name}
                  onChange={(e) => updateScene(index, 'name', e.target.value)}
                  placeholder="Nombre"
                />
                <input
                  type="number"
                  min="0"
                  max="127"
                  value={scene.cc}
                  onChange={(e) => updateScene(index, 'cc', parseInt(e.target.value))}
                  placeholder="CC"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>Metadata (Opcional)</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Artista</label>
              <input
                type="text"
                value={song.metadata?.artist || ''}
                onChange={(e) => updateMetadata('artist', e.target.value)}
                placeholder="Ej: Hillsong"
              />
            </div>

            <div className="form-group">
              <label>Tonalidad</label>
              <input
                type="text"
                value={song.metadata?.key || ''}
                onChange={(e) => updateMetadata('key', e.target.value)}
                placeholder="Ej: G, Am, D#"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>BPM</label>
              <input
                type="number"
                value={song.metadata?.bpm || ''}
                onChange={(e) => updateMetadata('bpm', e.target.value)}
                placeholder="Ej: 120"
              />
            </div>

            <div className="form-group">
              <label>Duración</label>
              <input
                type="text"
                value={song.metadata?.duration || ''}
                onChange={(e) => updateMetadata('duration', e.target.value)}
                placeholder="Ej: 4:30"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Notas</label>
            <textarea
              value={song.metadata?.notes || ''}
              onChange={(e) => updateMetadata('notes', e.target.value)}
              placeholder="Notas adicionales sobre la canción..."
              rows="3"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ========== SETLISTS MANAGER ==========
function SetlistsManager({ setlists, songs, onEdit, onDelete, onCreate }) {
  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Setlists ({setlists.length})</h2>
        <button className="create-btn" onClick={onCreate}>
          ➕ Nuevo Setlist
        </button>
      </div>

      <div className="items-list">
        {setlists.map(setlist => (
          <div key={setlist.id} className="item-card">
            <div className="item-info">
              <div className="item-name">{setlist.name}</div>
              <div className="item-details">
                {setlist.songs.length} canciones
              </div>
            </div>
            <div className="item-actions">
              <button className="edit-btn-small" onClick={() => onEdit(setlist)}>
                ✏️ Editar
              </button>
              <button className="delete-btn-small" onClick={() => onDelete(setlist.id)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ========== SETLIST EDITOR ==========
function SetlistEditor({ setlist, songs, onChange, onSave, onCancel }) {
  const updateField = (field, value) => {
    onChange({ ...setlist, [field]: value })
  }

  const addSong = (songId) => {
    if (!setlist.songs.includes(songId)) {
      onChange({ ...setlist, songs: [...setlist.songs, songId] })
    }
  }

  const removeSong = (songId) => {
    onChange({
      ...setlist,
      songs: setlist.songs.filter(id => id !== songId)
    })
  }

  const moveSongUp = (index) => {
    if (index === 0) return
    const newSongs = [...setlist.songs]
    ;[newSongs[index - 1], newSongs[index]] = [newSongs[index], newSongs[index - 1]]
    onChange({ ...setlist, songs: newSongs })
  }

  const moveSongDown = (index) => {
    if (index === setlist.songs.length - 1) return
    const newSongs = [...setlist.songs]
    ;[newSongs[index], newSongs[index + 1]] = [newSongs[index + 1], newSongs[index]]
    onChange({ ...setlist, songs: newSongs })
  }

  const availableSongs = songs.filter(s => !setlist.songs.includes(s.id))
  const selectedSongs = setlist.songs.map(id => songs.find(s => s.id === id)).filter(Boolean)

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h2>{setlist.name || 'Nuevo Setlist'}</h2>
        <div className="editor-actions">
          <button className="cancel-btn" onClick={onCancel}>Cancelar</button>
          <button className="save-btn" onClick={onSave}>💾 Guardar</button>
        </div>
      </div>

      <div className="editor-form">
        <div className="form-section">
          <h3>Información Básica</h3>

          <div className="form-group">
            <label>Nombre del Setlist *</label>
            <input
              type="text"
              value={setlist.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Ej: Domingo - Alabanza"
            />
          </div>

          <div className="form-group">
            <label>Fecha del Evento *</label>
            <input
              type="date"
              value={setlist.eventDate || ''}
              onChange={(e) => updateField('eventDate', e.target.value)}
            />
            <small>Solo se mostrarán setlists con fecha igual o posterior a hoy</small>
          </div>
        </div>

        <div className="form-section">
          <h3>Canciones en el Setlist ({selectedSongs.length})</h3>

          <div className="setlist-songs">
            {selectedSongs.map((song, index) => (
              <div key={song.id} className="setlist-song-item">
                <div className="song-order">{index + 1}</div>
                <div className="song-info-compact">
                  <div className="song-name-compact">{song.name}</div>
                  <div className="song-preset-compact">Preset: {song.programChange}</div>
                </div>
                <div className="song-controls">
                  <button
                    className="move-btn"
                    onClick={() => moveSongUp(index)}
                    disabled={index === 0}
                  >
                    ▲
                  </button>
                  <button
                    className="move-btn"
                    onClick={() => moveSongDown(index)}
                    disabled={index === selectedSongs.length - 1}
                  >
                    ▼
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => removeSong(song.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            {selectedSongs.length === 0 && (
              <div className="empty-message">
                No hay canciones en este setlist. Agrega canciones abajo.
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Agregar Canciones</h3>

          <div className="available-songs">
            {availableSongs.map(song => (
              <div key={song.id} className="available-song-item">
                <div className="song-info-compact">
                  <div className="song-name-compact">{song.name}</div>
                  <div className="song-preset-compact">Preset: {song.programChange}</div>
                </div>
                <button
                  className="add-btn-small"
                  onClick={() => addSong(song.id)}
                >
                  ➕ Agregar
                </button>
              </div>
            ))}

            {availableSongs.length === 0 && (
              <div className="empty-message">
                Todas las canciones ya están en el setlist.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditMode

