import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const SONGS_FILE = path.join(DATA_DIR, 'songs.json');
const SETLISTS_FILE = path.join(DATA_DIR, 'setlists.json');

class DataManager {
  constructor() {
    this.songs = [];
    this.setlists = [];
  }

  /**
   * Initialize data manager - load JSON files
   */
  async initialize() {
    try {
      await this.loadSongs();
      await this.loadSetlists();
      console.log(`✅ Datos cargados: ${this.songs.length} canciones, ${this.setlists.length} setlists`);
    } catch (error) {
      console.error('❌ Error inicializando datos:', error.message);
      throw error;
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

    this.songs.push(songData);
    await this.saveSongs();
    return songData;
  }

  async updateSong(id, songData) {
    const index = this.songs.findIndex(song => song.id === id);
    if (index === -1) {
      throw new Error(`Song not found: ${id}`);
    }

    this.songs[index] = { ...this.songs[index], ...songData };
    await this.saveSongs();
    return this.songs[index];
  }

  async deleteSong(id) {
    const index = this.songs.findIndex(song => song.id === id);
    if (index === -1) {
      throw new Error(`Song not found: ${id}`);
    }

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
  getSetlistWithSongs(id) {
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

    this.setlists.push(setlistData);
    await this.saveSetlists();
    return setlistData;
  }

  async updateSetlist(id, setlistData) {
    const index = this.setlists.findIndex(setlist => setlist.id === id);
    if (index === -1) {
      throw new Error(`Setlist not found: ${id}`);
    }

    this.setlists[index] = { ...this.setlists[index], ...setlistData };
    await this.saveSetlists();
    return this.setlists[index];
  }

  async deleteSetlist(id) {
    const index = this.setlists.findIndex(setlist => setlist.id === id);
    if (index === -1) {
      throw new Error(`Setlist not found: ${id}`);
    }

    this.setlists.splice(index, 1);
    await this.saveSetlists();
  }
}

const dataManager = new DataManager();

export default dataManager;

