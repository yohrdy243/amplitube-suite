import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import supabaseManager from './supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const SONGS_FILE = path.join(DATA_DIR, 'songs.json');
const SETLISTS_FILE = path.join(DATA_DIR, 'setlists.json');

class DataManager {
  constructor() {
    this.songs = [];
    this.setlists = [];
    this.useSupabase = false;
  }

  /**
   * Initialize data manager - load from Supabase or JSON files
   */
  async initialize() {
    try {
      // Initialize Supabase
      this.useSupabase = supabaseManager.initialize();

      if (this.useSupabase) {
        console.log('☁️  Usando Supabase como fuente de datos');
        await this.loadFromSupabase();
      } else {
        console.log('📁 Usando archivos JSON locales');
        await this.loadFromLocal();
      }

      console.log(`✅ Datos cargados: ${this.songs.length} canciones, ${this.setlists.length} setlists`);
    } catch (error) {
      console.error('❌ Error inicializando datos:', error.message);

      // Fallback to local if Supabase fails
      if (this.useSupabase) {
        console.log('⚠️  Supabase falló, usando archivos locales como fallback');
        this.useSupabase = false;
        await this.loadFromLocal();
      } else {
        throw error;
      }
    }
  }

  /**
   * Load data from Supabase
   */
  async loadFromSupabase() {
    const songs = await supabaseManager.fetchSongsWithScenes();
    const setlists = await supabaseManager.fetchSetlistsWithSongs();

    if (songs === null || setlists === null) {
      throw new Error('Failed to fetch data from Supabase');
    }

    this.songs = songs;
    this.setlists = setlists;

    // Cache to local files as backup
    await this.cacheToLocal();
  }

  /**
   * Load data from local JSON files
   */
  async loadFromLocal() {
    await this.loadSongs();
    await this.loadSetlists();
  }

  /**
   * Cache current data to local JSON files (backup)
   */
  async cacheToLocal() {
    try {
      await this.saveSongs();
      await this.saveSetlists();
      console.log('💾 Datos cacheados localmente');
    } catch (error) {
      console.error('⚠️  Error cacheando datos localmente:', error.message);
    }
  }

  /**
   * Load songs from JSON file
   */
  async loadSongs() {
    try {
      const data = await fs.readFile(SONGS_FILE, 'utf-8');
      this.songs = JSON.parse(data);
    } catch (error) {
      console.error('❌ Error cargando songs.json:', error.message);
      this.songs = [];
    }
  }

  /**
   * Load setlists from JSON file
   */
  async loadSetlists() {
    try {
      const data = await fs.readFile(SETLISTS_FILE, 'utf-8');
      this.setlists = JSON.parse(data);
    } catch (error) {
      console.error('❌ Error cargando setlists.json:', error.message);
      this.setlists = [];
    }
  }

  /**
   * Save songs to JSON file
   */
  async saveSongs() {
    try {
      await fs.writeFile(SONGS_FILE, JSON.stringify(this.songs, null, 2), 'utf-8');
      console.log('💾 songs.json guardado');
    } catch (error) {
      console.error('❌ Error guardando songs.json:', error.message);
      throw error;
    }
  }

  /**
   * Save setlists to JSON file
   */
  async saveSetlists() {
    try {
      await fs.writeFile(SETLISTS_FILE, JSON.stringify(this.setlists, null, 2), 'utf-8');
      console.log('💾 setlists.json guardado');
    } catch (error) {
      console.error('❌ Error guardando setlists.json:', error.message);
      throw error;
    }
  }

  // ========== SONGS ==========

  getAllSongs() {
    return this.songs;
  }

  getSongById(id) {
    return this.songs.find(song => song.id === id);
  }

  async createSong(songData) {
    // Validate song structure (required fields)
    if (!songData.name || songData.programChange === undefined || !songData.scenes || songData.scenes.length !== 4) {
      throw new Error('Invalid song data: must have name, programChange, and exactly 4 scenes');
    }

    // Ensure metadata exists (optional fields)
    if (!songData.metadata) {
      songData.metadata = {
        artist: '',
        key: '',
        bpm: null,
        duration: '',
        youtubeUrl: '',
        albumArt: '',
        notes: ''
      };
    }

    // Create in Supabase if enabled
    if (this.useSupabase) {
      const result = await supabaseManager.createSong(songData);
      if (result) {
        this.songs.push(result);
        await this.cacheToLocal();
        return result;
      } else {
        throw new Error('Failed to create song in Supabase');
      }
    }

    // Fallback to local
    this.songs.push(songData);
    await this.saveSongs();
    return songData;
  }

  async updateSong(id, songData) {
    const index = this.songs.findIndex(song => song.id === id);
    if (index === -1) {
      throw new Error(`Song not found: ${id}`);
    }

    // Update in Supabase if enabled
    if (this.useSupabase) {
      const result = await supabaseManager.updateSong(id, songData);
      if (result) {
        this.songs[index] = result;
        await this.cacheToLocal();
        return result;
      } else {
        throw new Error('Failed to update song in Supabase');
      }
    }

    // Fallback to local
    this.songs[index] = { ...this.songs[index], ...songData };
    await this.saveSongs();
    return this.songs[index];
  }

  async deleteSong(id) {
    const index = this.songs.findIndex(song => song.id === id);
    if (index === -1) {
      throw new Error(`Song not found: ${id}`);
    }

    // Delete from Supabase if enabled
    if (this.useSupabase) {
      const success = await supabaseManager.deleteSong(id);
      if (!success) {
        throw new Error('Failed to delete song from Supabase');
      }
    }

    // Remove from local cache
    this.songs.splice(index, 1);
    await this.saveSongs();
  }

  // ========== SETLISTS ==========

  getAllSetlists() {
    return this.setlists;
  }

  getSetlistById(id) {
    return this.setlists.find(setlist => setlist.id === id);
  }

  /**
   * Get setlist with full song details
   */
  async getSetlistWithSongs(id) {
    // Use Supabase if enabled (more efficient with JOIN)
    if (this.useSupabase) {
      const result = await supabaseManager.getSetlistWithSongs(id);
      if (result) return result;
    }

    // Fallback to local
    const setlist = this.getSetlistById(id);
    if (!setlist) return null;

    const songsWithDetails = setlist.songs
      .map(songId => this.getSongById(songId))
      .filter(song => song !== undefined);

    return {
      ...setlist,
      songs: songsWithDetails
    };
  }

  async createSetlist(setlistData) {
    if (!setlistData.name || !setlistData.songs || !Array.isArray(setlistData.songs)) {
      throw new Error('Invalid setlist data: must have name and songs array');
    }

    // Create in Supabase if enabled
    if (this.useSupabase) {
      const result = await supabaseManager.createSetlist(setlistData);
      if (result) {
        this.setlists.push(result);
        await this.cacheToLocal();
        return result;
      } else {
        throw new Error('Failed to create setlist in Supabase');
      }
    }

    // Fallback to local
    this.setlists.push(setlistData);
    await this.saveSetlists();
    return setlistData;
  }

  async updateSetlist(id, setlistData) {
    const index = this.setlists.findIndex(setlist => setlist.id === id);
    if (index === -1) {
      throw new Error(`Setlist not found: ${id}`);
    }

    // Update in Supabase if enabled
    if (this.useSupabase) {
      const result = await supabaseManager.updateSetlist(id, setlistData);
      if (result) {
        this.setlists[index] = result;
        await this.cacheToLocal();
        return result;
      } else {
        throw new Error('Failed to update setlist in Supabase');
      }
    }

    // Fallback to local
    this.setlists[index] = { ...this.setlists[index], ...setlistData };
    await this.saveSetlists();
    return this.setlists[index];
  }

  async deleteSetlist(id) {
    const index = this.setlists.findIndex(setlist => setlist.id === id);
    if (index === -1) {
      throw new Error(`Setlist not found: ${id}`);
    }

    // Delete from Supabase if enabled
    if (this.useSupabase) {
      const success = await supabaseManager.deleteSetlist(id);
      if (!success) {
        throw new Error('Failed to delete setlist from Supabase');
      }
    }

    // Remove from local cache
    this.setlists.splice(index, 1);
    await this.saveSetlists();
  }
}

const dataManager = new DataManager();

export default dataManager;

