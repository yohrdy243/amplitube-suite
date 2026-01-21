import { useState, useEffect } from 'react'
import './LiveMode.css'

function LiveMode({ setlist, onBack }) {
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [midiStatus, setMidiStatus] = useState({ connected: false })
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)
  const [metronomeBeat, setMetronomeBeat] = useState(0) // 0 = no beat, 1 = accent, 2 = normal
  const [metronomeEnabled, setMetronomeEnabled] = useState(true) // Auto-enabled
  const [tempoMultiplier, setTempoMultiplier] = useState(1) // 1 = normal, 2 = double
  const [activeSceneIndex, setActiveSceneIndex] = useState(0) // Track active scene

  const currentSong = setlist.songs[currentSongIndex]
  const nextSong = currentSongIndex < setlist.songs.length - 1 ? setlist.songs[currentSongIndex + 1] : null
  const hasNextSong = currentSongIndex < setlist.songs.length - 1

  // Get BPM and time signature from metadata
  const baseBpm = currentSong?.metadata?.bpm ? parseInt(currentSong.metadata.bpm) : null
  const bpm = baseBpm ? baseBpm * tempoMultiplier : null
  const timeSignature = currentSong?.metadata?.timeSignature || '4/4'
  const beatsPerMeasure = parseInt(timeSignature.split('/')[0]) || 4

  // Check MIDI status on mount
  useEffect(() => {
    checkMidiStatus()
  }, [])

  // Send Program Change when song changes, then send first scene CC
  useEffect(() => {
    if (currentSong) {
      console.log('Song changed, resetting to first scene')
      sendProgramChange(currentSong.programChange)

      // Reset to first scene when song changes
      setActiveSceneIndex(0)

      // After sending program change, send first scene CC
      if (currentSong.scenes && currentSong.scenes.length > 0) {
        setTimeout(() => {
          console.log('Sending first scene CC:', currentSong.scenes[0].cc)
          sendControlChange(currentSong.scenes[0].cc)
        }, 100) // Small delay to ensure program change is processed first
      }
    }
  }, [currentSongIndex])

  const checkMidiStatus = async () => {
    try {
      const response = await fetch('/api/midi/status')
      const status = await response.json()
      setMidiStatus(status)
    } catch (error) {
      console.error('Error checking MIDI status:', error)
    }
  }

  const sendProgramChange = async (programChange) => {
    try {
      // Subtract 1 from programChange to match AmpliTube preset numbering
      // UI shows "1" but MIDI sends "0" (first preset)
      const midiProgramChange = programChange - 1

      const response = await fetch('/api/midi/program-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ programChange: midiProgramChange })
      })

      if (!response.ok) {
        console.error('Failed to send Program Change')
      }
    } catch (error) {
      console.error('Error sending Program Change:', error)
    }
  }

  const sendControlChange = async (cc) => {
    try {
      const response = await fetch('/api/midi/control-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cc, value: 127 })
      })

      if (!response.ok) {
        console.error('Failed to send Control Change')
      }
    } catch (error) {
      console.error('Error sending Control Change:', error)
    }
  }

  const handleSceneClick = (scene, index) => {
    console.log('Scene clicked:', scene.name, 'index:', index)
    setActiveSceneIndex(index)
    sendControlChange(scene.cc)
  }

  const handleNextSong = () => {
    if (hasNextSong) {
      setCurrentSongIndex(prev => prev + 1)
    }
  }

  const handlePrevSong = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(prev => prev - 1)
    }
  }

  // Detect if running as standalone (added to home screen on iOS)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                       window.navigator.standalone === true

  // Check if it's iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

  const handleFullscreenClick = () => {
    if (isIOS && !isStandalone) {
      // Show instructions for iOS
      setShowIOSInstructions(true)
      setTimeout(() => setShowIOSInstructions(false), 5000)
    } else {
      // Try standard fullscreen API for other browsers
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.()
      } else {
        document.exitFullscreen?.()
      }
    }
  }

  // Auto-hide address bar on iOS by scrolling
  useEffect(() => {
    const hideAddressBar = () => {
      window.scrollTo(0, 1)
    }

    // Hide on load
    setTimeout(hideAddressBar, 100)

    // Hide on orientation change
    window.addEventListener('orientationchange', hideAddressBar)
    return () => window.removeEventListener('orientationchange', hideAddressBar)
  }, [])

  // Metronome effect based on BPM and time signature - AUTO START
  useEffect(() => {
    if (!bpm || !metronomeEnabled) {
      setMetronomeBeat(0)
      return
    }

    // Calculate interval in milliseconds (60000ms / BPM)
    const interval = 60000 / bpm
    let beatCount = 0

    // Create audio context for metronome sounds
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()

    const playClick = (isAccent) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Accent (first beat) is higher pitch and louder
      oscillator.frequency.value = isAccent ? 1200 : 800
      gainNode.gain.value = isAccent ? 0.3 : 0.15

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.05)

      // Fade out
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05)
    }

    // Start immediately with first beat
    beatCount = 1
    setMetronomeBeat(1)
    playClick(true)
    setTimeout(() => setMetronomeBeat(0), 100)

    const metronomeInterval = setInterval(() => {
      beatCount = (beatCount % beatsPerMeasure) + 1
      const isAccent = beatCount === 1

      // Set visual state: 1 = accent, 2 = normal beat
      setMetronomeBeat(isAccent ? 1 : 2)

      // Play sound
      playClick(isAccent)

      // Reset visual after flash
      setTimeout(() => setMetronomeBeat(0), 100)
    }, interval)

    return () => {
      clearInterval(metronomeInterval)
      audioContext.close()
    }
  }, [bpm, beatsPerMeasure, currentSongIndex, metronomeEnabled])

  const toggleTempo = () => {
    setTempoMultiplier(prev => prev === 1 ? 2 : 1)
  }

  if (!currentSong) {
    return (
      <div className="live-mode">
        <div className="error">No hay canciones en este setlist</div>
      </div>
    )
  }

  return (
    <div className={`live-mode ${metronomeBeat === 1 ? 'metronome-accent' : metronomeBeat === 2 ? 'metronome-beat' : ''}`}>
      {/* Metronome Border Effect */}
      <div className="metronome-border-top"></div>
      <div className="metronome-border-right"></div>
      <div className="metronome-border-bottom"></div>
      <div className="metronome-border-left"></div>

      {/* Floating Back Button */}
      <button className="floating-back-btn" onClick={onBack}>
        ◂
      </button>

      {/* Song Title - Clean Header */}
      <div className="song-title">
        <div className="song-name">{currentSong.name}</div>
        {nextSong && (
          <div className="next-song-preview">
            <span className="next-label">NEXT:</span> {nextSong.name}
          </div>
        )}
        {currentSong.metadata && (
          <div className="song-metadata">
            {currentSong.metadata.artist && (
              <span className="metadata-item">🎤 {currentSong.metadata.artist}</span>
            )}
            {currentSong.metadata.key && (
              <span className="metadata-item">🎵 {currentSong.metadata.key}</span>
            )}
            {currentSong.metadata.bpm && (
              <span className="metadata-item">
                ⏱️ {bpm} BPM {tempoMultiplier === 2 && <span className="tempo-indicator">(2x)</span>}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Scenes Grid 2x2 */}
      <div className="scenes-grid">
        {currentSong.scenes.map((scene, index) => (
          <button
            key={index}
            className={`scene-btn ${activeSceneIndex === index ? 'active' : ''}`}
            onClick={() => handleSceneClick(scene, index)}
          >
            <div className="scene-number">{index + 1}</div>
            <div className="scene-name">{scene.name}</div>
            <div className="scene-cc">CC {scene.cc}</div>
          </button>
        ))}
      </div>

      {/* Controls Bar - All controls together */}
      <div className="controls-bar">
        {/* MIDI Indicator */}
        <div className={`midi-indicator ${midiStatus.connected ? 'connected' : 'disconnected'}`}>
          {midiStatus.connected ? '●' : '○'}
        </div>

        {/* Metronome Toggle */}
        {baseBpm && (
          <button
            className={`control-btn metronome-btn ${metronomeEnabled ? 'active' : ''}`}
            onClick={() => setMetronomeEnabled(!metronomeEnabled)}
            title={metronomeEnabled ? 'Desactivar metrónomo' : 'Activar metrónomo'}
          >
            ♪
          </button>
        )}

        {/* Tempo Multiplier */}
        {baseBpm && metronomeEnabled && (
          <button
            className={`control-btn tempo-btn ${tempoMultiplier === 2 ? 'active' : ''}`}
            onClick={toggleTempo}
            title={`Tempo: ${tempoMultiplier}x (${bpm} BPM)`}
          >
            {tempoMultiplier}x
          </button>
        )}

        {/* Fullscreen Button - Hidden on iOS */}
        {!isIOS && (
          <button
            className="control-btn fullscreen-btn"
            onClick={handleFullscreenClick}
            title={isStandalone ? 'Modo pantalla completa activo' : 'Pantalla completa'}
          >
            {isStandalone ? '✓' : '⊞'}
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="song-navigation">
        <button
          className="nav-btn prev-btn"
          onClick={handlePrevSong}
          disabled={currentSongIndex === 0}
        >
          ← Anterior
        </button>
        <button
          className="nav-btn next-btn"
          onClick={handleNextSong}
          disabled={!hasNextSong}
        >
          Siguiente →
        </button>
      </div>

      {/* iOS Fullscreen Instructions */}
      {showIOSInstructions && (
        <div className="ios-instructions-overlay" onClick={() => setShowIOSInstructions(false)}>
          <div className="ios-instructions-modal">
            <div className="ios-instructions-header">
              📱 Pantalla Completa en iPhone
            </div>
            <div className="ios-instructions-content">
              <div className="ios-step">
                <div className="ios-step-number">1</div>
                <div className="ios-step-text">Toca el botón <strong>Compartir</strong> (↑)</div>
              </div>
              <div className="ios-step">
                <div className="ios-step-number">2</div>
                <div className="ios-step-text">Selecciona <strong>"Agregar a pantalla de inicio"</strong></div>
              </div>
              <div className="ios-step">
                <div className="ios-step-number">3</div>
                <div className="ios-step-text">Abre la app desde el ícono en tu pantalla de inicio</div>
              </div>
            </div>
            <div className="ios-instructions-footer">
              Toca para cerrar
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LiveMode

