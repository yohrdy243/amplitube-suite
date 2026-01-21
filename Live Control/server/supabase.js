import { createClient } from '@supabase/supabase-js';

class SupabaseManager {
  constructor() {
    this.client = null;
    this.isEnabled = false;
  }

  /**
   * Initialize Supabase client
   */
  initialize() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.log('ℹ️  Supabase no configurado - funcionando en modo local');
      return false;
    }

    try {
      this.client = createClient(supabaseUrl, supabaseKey);
      this.isEnabled = true;
      console.log('✅ Supabase conectado');
      return true;
    } catch (error) {
      console.error('❌ Error conectando a Supabase:', error.message);
      return false;
    }
  }

  /**
   * Sync songs to Supabase
   */
  async syncSongs(songs) {
    if (!this.isEnabled) return false;

    try {
      const { error } = await this.client
        .from('songs')
        .upsert(songs);

      if (error) throw error;
      console.log('✅ Canciones sincronizadas con Supabase');
      return true;
    } catch (error) {
      console.error('❌ Error sincronizando canciones:', error.message);
      return false;
    }
  }

  /**
   * Sync setlists to Supabase
   */
  async syncSetlists(setlists) {
    if (!this.isEnabled) return false;

    try {
      const { error } = await this.client
        .from('setlists')
        .upsert(setlists);

      if (error) throw error;
      console.log('✅ Setlists sincronizados con Supabase');
      return true;
    } catch (error) {
      console.error('❌ Error sincronizando setlists:', error.message);
      return false;
    }
  }

  /**
   * Fetch songs from Supabase
   */
  async fetchSongs() {
    if (!this.isEnabled) return null;

    try {
      const { data, error } = await this.client
        .from('songs')
        .select('*');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error obteniendo canciones:', error.message);
      return null;
    }
  }

  /**
   * Fetch setlists from Supabase
   */
  async fetchSetlists() {
    if (!this.isEnabled) return null;

    try {
      const { data, error } = await this.client
        .from('setlists')
        .select('*');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error obteniendo setlists:', error.message);
      return null;
    }
  }

  /**
   * Check if Supabase is enabled
   */
  isReady() {
    return this.isEnabled;
  }
}

const supabaseManager = new SupabaseManager();

export default supabaseManager;

