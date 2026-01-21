import { createClient } from '@supabase/supabase-js';

class SupabaseManager {
  constructor() {
    this.client = null;
    this.isEnabled = false;
    this.realtimeChannels = [];
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
   * Subscribe to realtime changes on a table
   * @param {string} table - Table name (songs, setlists, etc.)
   * @param {function} callback - Callback function (payload) => {}
   */
  subscribeToTable(table, callback) {
    if (!this.isEnabled) return null;

    try {
      const channel = this.client
        .channel(`${table}-changes`)
        .on(
          'postgres_changes',
          {
            event: '*', // INSERT, UPDATE, DELETE
            schema: 'public',
            table: table
          },
          (payload) => {
            console.log(`🔄 Cambio en ${table}:`, payload.eventType);
            callback(payload);
          }
        )
        .subscribe();

      this.realtimeChannels.push(channel);
      console.log(`👂 Escuchando cambios en tiempo real: ${table}`);
      return channel;
    } catch (error) {
      console.error(`❌ Error suscribiendo a ${table}:`, error.message);
      return null;
    }
  }

  /**
   * Unsubscribe from all realtime channels
   */
  unsubscribeAll() {
    if (!this.isEnabled) return;

    this.realtimeChannels.forEach(channel => {
      this.client.removeChannel(channel);
    });
    this.realtimeChannels = [];
    console.log('🔇 Desuscrito de todos los canales realtime');
  }

  // ========== SONGS ==========

  /**
   * Fetch all songs with their scenes
   */
  async fetchSongsWithScenes() {
    if (!this.isEnabled) return null;

    try {
      const { data, error } = await this.client
        .from('songs')
        .select(`
          *,
          scenes (
            id,
            name,
            cc,
            position
          )
        `)
        .order('name');

      if (error) throw error;

      // Transform to match local JSON format
      return data.map(song => ({
        id: song.id,
        name: song.name,
        programChange: song.program_change,
        scenes: (song.scenes || [])
          .sort((a, b) => a.position - b.position)
          .map(scene => ({
            name: scene.name,
            cc: scene.cc
          })),
        metadata: {
          artist: song.artist || '',
          key: song.key || '',
          bpm: song.bpm || null,
          duration: song.duration || '',
          youtubeUrl: song.youtube_url || '',
          albumArt: song.album_art || '',
          notes: song.notes || ''
        }
      }));
    } catch (error) {
      console.error('❌ Error obteniendo canciones:', error.message);
      return null;
    }
  }

  /**
   * Get song by ID with scenes
   */
  async getSongById(id) {
    if (!this.isEnabled) return null;

    try {
      const { data, error } = await this.client
        .from('songs')
        .select(`
          *,
          scenes (
            id,
            name,
            cc,
            position
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Transform to match local JSON format
      return {
        id: data.id,
        name: data.name,
        programChange: data.program_change,
        scenes: (data.scenes || [])
          .sort((a, b) => a.position - b.position)
          .map(scene => ({
            name: scene.name,
            cc: scene.cc
          })),
        metadata: {
          artist: data.artist || '',
          key: data.key || '',
          bpm: data.bpm || null,
          duration: data.duration || '',
          youtubeUrl: data.youtube_url || '',
          albumArt: data.album_art || '',
          notes: data.notes || ''
        }
      };
    } catch (error) {
      console.error('❌ Error obteniendo canción:', error.message);
      return null;
    }
  }

  /**
   * Create new song with scenes
   */
  async createSong(songData) {
    if (!this.isEnabled) return null;

    try {
      // Insert song
      const { data: song, error: songError } = await this.client
        .from('songs')
        .insert({
          id: songData.id,
          name: songData.name,
          program_change: songData.programChange,
          artist: songData.metadata?.artist || '',
          key: songData.metadata?.key || '',
          bpm: songData.metadata?.bpm || null,
          duration: songData.metadata?.duration || '',
          youtube_url: songData.metadata?.youtubeUrl || '',
          album_art: songData.metadata?.albumArt || '',
          notes: songData.metadata?.notes || ''
        })
        .select()
        .single();

      if (songError) throw songError;

      // Insert scenes
      const scenesData = songData.scenes.map((scene, index) => ({
        song_id: songData.id,
        name: scene.name || '',
        cc: scene.cc,
        position: index
      }));

      const { error: scenesError } = await this.client
        .from('scenes')
        .insert(scenesData);

      if (scenesError) throw scenesError;

      return await this.getSongById(songData.id);
    } catch (error) {
      console.error('❌ Error creando canción:', error.message);
      return null;
    }
  }

  /**
   * Update song with scenes
   */
  async updateSong(id, songData) {
    if (!this.isEnabled) return null;

    try {
      // Update song
      const updateData = {
        name: songData.name,
        program_change: songData.programChange
      };

      if (songData.metadata) {
        updateData.artist = songData.metadata.artist || '';
        updateData.key = songData.metadata.key || '';
        updateData.bpm = songData.metadata.bpm || null;
        updateData.duration = songData.metadata.duration || '';
        updateData.youtube_url = songData.metadata.youtubeUrl || '';
        updateData.album_art = songData.metadata.albumArt || '';
        updateData.notes = songData.metadata.notes || '';
      }

      const { error: songError } = await this.client
        .from('songs')
        .update(updateData)
        .eq('id', id);

      if (songError) throw songError;

      // Update scenes if provided
      if (songData.scenes) {
        // Delete existing scenes
        await this.client
          .from('scenes')
          .delete()
          .eq('song_id', id);

        // Insert new scenes
        const scenesData = songData.scenes.map((scene, index) => ({
          song_id: id,
          name: scene.name || '',
          cc: scene.cc,
          position: index
        }));

        const { error: scenesError } = await this.client
          .from('scenes')
          .insert(scenesData);

        if (scenesError) throw scenesError;
      }

      return await this.getSongById(id);
    } catch (error) {
      console.error('❌ Error actualizando canción:', error.message);
      return null;
    }
  }

  /**
   * Delete song (scenes are deleted automatically via CASCADE)
   */
  async deleteSong(id) {
    if (!this.isEnabled) return false;

    try {
      const { error } = await this.client
        .from('songs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('❌ Error eliminando canción:', error.message);
      return false;
    }
  }

  // ========== SETLISTS ==========

  /**
   * Fetch all setlists with their songs
   */
  async fetchSetlistsWithSongs() {
    if (!this.isEnabled) return null;

    try {
      const { data, error } = await this.client
        .from('setlists')
        .select(`
          *,
          setlist_songs (
            position,
            song_id,
            songs (
              id,
              name,
              program_change,
              artist,
              key,
              bpm,
              duration,
              youtube_url,
              album_art,
              notes
            )
          )
        `)
        .order('name');

      if (error) throw error;

      // Transform to match local JSON format
      return data.map(setlist => ({
        id: setlist.id,
        name: setlist.name,
        eventDate: setlist.event_date,
        songs: (setlist.setlist_songs || [])
          .sort((a, b) => a.position - b.position)
          .map(ss => ss.song_id)
      }));
    } catch (error) {
      console.error('❌ Error obteniendo setlists:', error.message);
      return null;
    }
  }

  /**
   * Get setlist by ID with full song details
   */
  async getSetlistWithSongs(id) {
    if (!this.isEnabled) return null;

    try {
      const { data, error } = await this.client
        .from('setlists')
        .select(`
          *,
          setlist_songs (
            position,
            songs (
              id,
              name,
              program_change,
              artist,
              key,
              bpm,
              duration,
              youtube_url,
              album_art,
              notes,
              scenes (
                id,
                name,
                cc,
                position
              )
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Transform to match local JSON format
      const songs = (data.setlist_songs || [])
        .sort((a, b) => a.position - b.position)
        .map(ss => {
          const song = ss.songs;
          return {
            id: song.id,
            name: song.name,
            programChange: song.program_change,
            scenes: (song.scenes || [])
              .sort((a, b) => a.position - b.position)
              .map(scene => ({
                name: scene.name,
                cc: scene.cc
              })),
            metadata: {
              artist: song.artist || '',
              key: song.key || '',
              bpm: song.bpm || null,
              duration: song.duration || '',
              youtubeUrl: song.youtube_url || '',
              albumArt: song.album_art || '',
              notes: song.notes || ''
            }
          };
        });

      return {
        id: data.id,
        name: data.name,
        eventDate: data.event_date,
        songs
      };
    } catch (error) {
      console.error('❌ Error obteniendo setlist:', error.message);
      return null;
    }
  }

  /**
   * Create new setlist with songs
   */
  async createSetlist(setlistData) {
    if (!this.isEnabled) return null;

    try {
      // Insert setlist
      const { data: setlist, error: setlistError } = await this.client
        .from('setlists')
        .insert({
          id: setlistData.id,
          name: setlistData.name,
          event_date: setlistData.eventDate || new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (setlistError) throw setlistError;

      // Insert setlist-songs relations
      if (setlistData.songs && setlistData.songs.length > 0) {
        const relationsData = setlistData.songs.map((songId, index) => ({
          setlist_id: setlistData.id,
          song_id: songId,
          position: index
        }));

        const { error: relationsError } = await this.client
          .from('setlist_songs')
          .insert(relationsData);

        if (relationsError) throw relationsError;
      }

      return {
        id: setlist.id,
        name: setlist.name,
        songs: setlistData.songs || []
      };
    } catch (error) {
      console.error('❌ Error creando setlist:', error.message);
      return null;
    }
  }

  /**
   * Update setlist with songs
   */
  async updateSetlist(id, setlistData) {
    if (!this.isEnabled) return null;

    try {
      // Update setlist
      const updateData = { name: setlistData.name };
      if (setlistData.eventDate) {
        updateData.event_date = setlistData.eventDate;
      }

      const { error: setlistError } = await this.client
        .from('setlists')
        .update(updateData)
        .eq('id', id);

      if (setlistError) throw setlistError;

      // Update songs if provided
      if (setlistData.songs) {
        // Delete existing relations
        await this.client
          .from('setlist_songs')
          .delete()
          .eq('setlist_id', id);

        // Insert new relations
        if (setlistData.songs.length > 0) {
          const relationsData = setlistData.songs.map((songId, index) => ({
            setlist_id: id,
            song_id: songId,
            position: index
          }));

          const { error: relationsError } = await this.client
            .from('setlist_songs')
            .insert(relationsData);

          if (relationsError) throw relationsError;
        }
      }

      return {
        id,
        name: setlistData.name,
        songs: setlistData.songs || []
      };
    } catch (error) {
      console.error('❌ Error actualizando setlist:', error.message);
      return null;
    }
  }

  /**
   * Delete setlist (relations are deleted automatically via CASCADE)
   */
  async deleteSetlist(id) {
    if (!this.isEnabled) return false;

    try {
      const { error } = await this.client
        .from('setlists')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('❌ Error eliminando setlist:', error.message);
      return false;
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

