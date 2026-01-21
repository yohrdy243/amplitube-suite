/**
 * ═══════════════════════════════════════════════════════════════════════
 * LIVE CONTROL - DATA MIGRATION SCRIPT
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Migra datos desde JSON local a Supabase
 * 
 * Uso:
 *   node supabase/migrate-data.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const SONGS_FILE = path.join(__dirname, '..', 'server', 'data', 'songs.json');
const SETLISTS_FILE = path.join(__dirname, '..', 'server', 'data', 'setlists.json');

async function migrate() {
  console.log('🚀 Iniciando migración de datos a Supabase...\n');

  // ═══════════════════════════════════════════════════════════════════════
  // 1. Verificar configuración de Supabase
  // ═══════════════════════════════════════════════════════════════════════
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: SUPABASE_URL y SUPABASE_ANON_KEY deben estar configurados en .env');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Conectado a Supabase\n');

  // ═══════════════════════════════════════════════════════════════════════
  // 2. Cargar datos locales
  // ═══════════════════════════════════════════════════════════════════════
  
  console.log('📂 Cargando datos locales...');
  
  const songsData = await fs.readFile(SONGS_FILE, 'utf-8');
  const songs = JSON.parse(songsData);
  console.log(`   ✅ ${songs.length} canciones cargadas`);

  const setlistsData = await fs.readFile(SETLISTS_FILE, 'utf-8');
  const setlists = JSON.parse(setlistsData);
  console.log(`   ✅ ${setlists.length} setlists cargados\n`);

  // ═══════════════════════════════════════════════════════════════════════
  // 3. Migrar canciones y escenas
  // ═══════════════════════════════════════════════════════════════════════
  
  console.log('🎵 Migrando canciones...');
  
  for (const song of songs) {
    // Insertar canción
    const songData = {
      id: song.id,
      name: song.name,
      program_change: song.programChange,
      artist: song.metadata?.artist || '',
      key: song.metadata?.key || '',
      bpm: song.metadata?.bpm || null,
      duration: song.metadata?.duration || '',
      youtube_url: song.metadata?.youtubeUrl || '',
      album_art: song.metadata?.albumArt || '',
      notes: song.metadata?.notes || ''
    };

    const { error: songError } = await supabase
      .from('songs')
      .upsert(songData);

    if (songError) {
      console.error(`   ❌ Error insertando canción ${song.name}:`, songError.message);
      continue;
    }

    // Insertar escenas
    for (let i = 0; i < song.scenes.length; i++) {
      const scene = song.scenes[i];
      const sceneData = {
        song_id: song.id,
        name: scene.name || '',
        cc: scene.cc,
        position: i
      };

      const { error: sceneError } = await supabase
        .from('scenes')
        .upsert(sceneData, { onConflict: 'song_id,position' });

      if (sceneError) {
        console.error(`   ❌ Error insertando escena ${i} de ${song.name}:`, sceneError.message);
      }
    }

    console.log(`   ✅ ${song.name} (${song.scenes.length} escenas)`);
  }

  console.log(`\n✅ ${songs.length} canciones migradas\n`);

  // ═══════════════════════════════════════════════════════════════════════
  // 4. Migrar setlists
  // ═══════════════════════════════════════════════════════════════════════
  
  console.log('📋 Migrando setlists...');
  
  for (const setlist of setlists) {
    // Insertar setlist
    const setlistData = {
      id: setlist.id,
      name: setlist.name
    };

    const { error: setlistError } = await supabase
      .from('setlists')
      .upsert(setlistData);

    if (setlistError) {
      console.error(`   ❌ Error insertando setlist ${setlist.name}:`, setlistError.message);
      continue;
    }

    // Insertar relaciones setlist-songs
    for (let i = 0; i < setlist.songs.length; i++) {
      const songId = setlist.songs[i];
      const relationData = {
        setlist_id: setlist.id,
        song_id: songId,
        position: i
      };

      const { error: relationError } = await supabase
        .from('setlist_songs')
        .upsert(relationData, { onConflict: 'setlist_id,song_id' });

      if (relationError) {
        console.error(`   ❌ Error insertando canción ${songId} en setlist:`, relationError.message);
      }
    }

    console.log(`   ✅ ${setlist.name} (${setlist.songs.length} canciones)`);
  }

  console.log(`\n✅ ${setlists.length} setlists migrados\n`);

  // ═══════════════════════════════════════════════════════════════════════
  // 5. Verificar migración
  // ═══════════════════════════════════════════════════════════════════════
  
  console.log('🔍 Verificando migración...');
  
  const { count: songsCount } = await supabase
    .from('songs')
    .select('*', { count: 'exact', head: true });
  
  const { count: scenesCount } = await supabase
    .from('scenes')
    .select('*', { count: 'exact', head: true });
  
  const { count: setlistsCount } = await supabase
    .from('setlists')
    .select('*', { count: 'exact', head: true });

  console.log(`   ✅ ${songsCount} canciones en Supabase`);
  console.log(`   ✅ ${scenesCount} escenas en Supabase`);
  console.log(`   ✅ ${setlistsCount} setlists en Supabase\n`);

  console.log('🎉 ¡Migración completada exitosamente!\n');
}

migrate().catch(console.error);

