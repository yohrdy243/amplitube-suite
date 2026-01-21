import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import midiController from './midi.js';
import dataManager from './dataManager.js';
import supabaseManager from './supabase.js';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build (production)
app.use(express.static(path.join(__dirname, '../client/dist')));

// ========== MIDI ENDPOINTS ==========

/**
 * GET /api/midi/status
 * Get MIDI connection status
 */
app.get('/api/midi/status', (req, res) => {
  const status = midiController.getStatus();
  res.json(status);
});

/**
 * POST /api/midi/program-change
 * Send Program Change message
 * Body: { programChange: number }
 */
app.post('/api/midi/program-change', (req, res) => {
  const { programChange } = req.body;

  if (programChange === undefined || programChange === null) {
    return res.status(400).json({ error: 'programChange is required' });
  }

  const success = midiController.sendProgramChange(programChange);

  if (success) {
    res.json({ success: true, programChange });
  } else {
    res.status(500).json({ error: 'Failed to send Program Change' });
  }
});

/**
 * POST /api/midi/control-change
 * Send Control Change message
 * Body: { cc: number, value?: number }
 */
app.post('/api/midi/control-change', (req, res) => {
  const { cc, value = 127 } = req.body;

  if (cc === undefined || cc === null) {
    return res.status(400).json({ error: 'cc is required' });
  }

  const success = midiController.sendControlChange(cc, value);

  if (success) {
    res.json({ success: true, cc, value });
  } else {
    res.status(500).json({ error: 'Failed to send Control Change' });
  }
});

// ========== SONGS ENDPOINTS ==========

/**
 * GET /api/songs
 * Get all songs
 */
app.get('/api/songs', (req, res) => {
  const songs = dataManager.getAllSongs();
  res.json(songs);
});

/**
 * GET /api/songs/:id
 * Get song by ID
 */
app.get('/api/songs/:id', (req, res) => {
  const song = dataManager.getSongById(req.params.id);
  if (!song) {
    return res.status(404).json({ error: 'Song not found' });
  }
  res.json(song);
});

/**
 * POST /api/songs
 * Create new song
 */
app.post('/api/songs', async (req, res) => {
  try {
    const song = await dataManager.createSong(req.body);
    res.status(201).json(song);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * PUT /api/songs/:id
 * Update song
 */
app.put('/api/songs/:id', async (req, res) => {
  try {
    const song = await dataManager.updateSong(req.params.id, req.body);
    res.json(song);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * DELETE /api/songs/:id
 * Delete song
 */
app.delete('/api/songs/:id', async (req, res) => {
  try {
    await dataManager.deleteSong(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ========== SETLISTS ENDPOINTS ==========

/**
 * GET /api/setlists
 * Get all setlists
 */
app.get('/api/setlists', (req, res) => {
  const setlists = dataManager.getAllSetlists();
  res.json(setlists);
});

/**
 * GET /api/setlists/:id
 * Get setlist by ID with full song details
 */
app.get('/api/setlists/:id', (req, res) => {
  const setlist = dataManager.getSetlistWithSongs(req.params.id);
  if (!setlist) {
    return res.status(404).json({ error: 'Setlist not found' });
  }
  res.json(setlist);
});

/**
 * POST /api/setlists
 * Create new setlist
 */
app.post('/api/setlists', async (req, res) => {
  try {
    const setlist = await dataManager.createSetlist(req.body);
    res.status(201).json(setlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Serve React app for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// ========== SERVER INITIALIZATION ==========

async function startServer() {
  try {
    console.log('\n🎸 LIVE CONTROL - AmpliTube MIDI Controller');
    console.log('==========================================\n');

    // Initialize data
    await dataManager.initialize();

    // Initialize Supabase (optional)
    supabaseManager.initialize();

    // Connect MIDI (async with JZZ)
    await midiController.connect();

    // Start server
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor iniciado en http://localhost:${PORT}`);
      console.log(`\n📱 Accede desde tu celular/tablet usando la IP de esta PC`);
      console.log(`   Ejemplo: http://192.168.1.100:${PORT}\n`);
    });

  } catch (error) {
    console.error('❌ Error fatal al iniciar servidor:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Cerrando servidor...');
  midiController.disconnect();
  process.exit(0);
});

startServer();

