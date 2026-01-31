import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import midiController from './midi.js';
import dataManager from './dataManager.js';
import supabaseManager from './supabase.js';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build (production)
app.use(express.static(path.join(__dirname, '../client/dist')));

// ========== WEBSOCKET / REALTIME ==========

io.on('connection', (socket) => {
  console.log('🔌 Cliente conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔌 Cliente desconectado:', socket.id);
  });
});

// Helper function to broadcast changes to all clients
function broadcastChange(event, data) {
  io.emit(event, data);
  console.log(`📡 Broadcasting: ${event}`, data.id || data);
}

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
    broadcastChange('song:created', song);
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
    broadcastChange('song:updated', song);
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
    broadcastChange('song:deleted', { id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ========== SETLISTS ENDPOINTS ==========

/**
 * GET /api/setlists
 * Get all setlists (optionally filter upcoming only)
 */
app.get('/api/setlists', (req, res) => {
  const { upcoming } = req.query;
  let setlists = dataManager.getAllSetlists();

  // Filter upcoming setlists (event_date > yesterday)
  // This shows setlists until AFTER the event date (inclusive of event day)
  if (upcoming === 'true') {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    setlists = setlists.filter(s => s.eventDate > yesterdayStr);
  }

  // Sort by event_date DESC (most recent first)
  setlists.sort((a, b) => {
    const dateA = a.eventDate || '9999-12-31';
    const dateB = b.eventDate || '9999-12-31';
    return dateB.localeCompare(dateA);
  });

  res.json(setlists);
});

/**
 * GET /api/setlists/:id
 * Get setlist by ID with full song details
 */
app.get('/api/setlists/:id', async (req, res) => {
  try {
    const setlist = await dataManager.getSetlistWithSongs(req.params.id);
    if (!setlist) {
      return res.status(404).json({ error: 'Setlist not found' });
    }
    res.json(setlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/setlists
 * Create new setlist
 */
app.post('/api/setlists', async (req, res) => {
  try {
    const setlist = await dataManager.createSetlist(req.body);
    broadcastChange('setlist:created', setlist);
    res.status(201).json(setlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * PUT /api/setlists/:id
 * Update setlist
 */
app.put('/api/setlists/:id', async (req, res) => {
  try {
    const setlist = await dataManager.updateSetlist(req.params.id, req.body);
    broadcastChange('setlist:updated', setlist);
    res.json(setlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * DELETE /api/setlists/:id
 * Delete setlist
 */
app.delete('/api/setlists/:id', async (req, res) => {
  try {
    await dataManager.deleteSetlist(req.params.id);
    broadcastChange('setlist:deleted', { id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Serve React app for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// ========== SUPABASE REALTIME SETUP ==========

/**
 * Setup Supabase Realtime subscriptions
 * Listen to database changes and broadcast to all connected clients
 */
function setupSupabaseRealtime() {
  console.log('🔄 Configurando Supabase Realtime...');

  // Subscribe to songs table changes
  supabaseManager.subscribeToTable('songs', async (payload) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    switch (eventType) {
      case 'INSERT':
        // Reload song with scenes
        const createdSong = await supabaseManager.getSongById(newRecord.id);
        if (createdSong) {
          await dataManager.loadFromSupabase(); // Refresh cache
          broadcastChange('song:created', createdSong);
        }
        break;

      case 'UPDATE':
        // Reload song with scenes
        const updatedSong = await supabaseManager.getSongById(newRecord.id);
        if (updatedSong) {
          await dataManager.loadFromSupabase(); // Refresh cache
          broadcastChange('song:updated', updatedSong);
        }
        break;

      case 'DELETE':
        await dataManager.loadFromSupabase(); // Refresh cache
        broadcastChange('song:deleted', { id: oldRecord.id });
        break;
    }
  });

  // Subscribe to setlists table changes
  supabaseManager.subscribeToTable('setlists', async (payload) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    switch (eventType) {
      case 'INSERT':
        await dataManager.loadFromSupabase(); // Refresh cache
        const createdSetlist = dataManager.getSetlistById(newRecord.id);
        if (createdSetlist) {
          broadcastChange('setlist:created', createdSetlist);
        }
        break;

      case 'UPDATE':
        await dataManager.loadFromSupabase(); // Refresh cache
        const updatedSetlist = dataManager.getSetlistById(newRecord.id);
        if (updatedSetlist) {
          broadcastChange('setlist:updated', updatedSetlist);
        }
        break;

      case 'DELETE':
        await dataManager.loadFromSupabase(); // Refresh cache
        broadcastChange('setlist:deleted', { id: oldRecord.id });
        break;
    }
  });

  // Subscribe to setlist_songs changes (when songs are added/removed from setlists)
  supabaseManager.subscribeToTable('setlist_songs', async (payload) => {
    // Reload all setlists when relationships change
    await dataManager.loadFromSupabase();
    const setlists = dataManager.getAllSetlists();
    broadcastChange('setlists:reloaded', setlists);
  });

  console.log('✅ Supabase Realtime configurado');
}

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

    // Setup Supabase Realtime (if enabled)
    if (supabaseManager.isReady()) {
      setupSupabaseRealtime();
    }

    // Start server
    httpServer.listen(PORT, () => {
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
  supabaseManager.unsubscribeAll();
  io.close();
  process.exit(0);
});

startServer();

