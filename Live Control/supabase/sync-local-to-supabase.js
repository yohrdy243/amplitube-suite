/**
 * ═══════════════════════════════════════════════════════════════════════
 * LIVE CONTROL - SYNC LOCAL TO SUPABASE (REPLACE ALL)
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * ELIMINA todos los datos en Supabase y los reemplaza con datos locales
 * 
 * ⚠️  ADVERTENCIA: Este script ELIMINA PERMANENTEMENTE todos los datos
 *     en Supabase y los reemplaza con los datos locales.
 * 
 * Uso:
 *   node supabase/sync-local-to-supabase.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const SONGS_FILE = path.join(__dirname, '..', 'server', 'data', 'songs.json');
const SETLISTS_FILE = path.join(__dirname, '..', 'server', 'data', 'setlists.json');

/**
 * Ask user for confirmation
 */
function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 's' || answer.toLowerCase() === 'y');
    });
  });
}

async function syncLocalToSupabase() {
  console.log('🚀 SINCRONIZACIÓN LOCAL → SUPABASE (REEMPLAZO TOTAL)\n');
  console.log('⚠️  ADVERTENCIA: Este script eliminará TODOS los datos en Supabase');
  console.log('   y los reemplazará con los datos locales.\n');

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
  // 3. Confirmación del usuario
  // ═══════════════════════════════════════════════════════════════════════
  
  const confirmed = await askConfirmation(
    `¿Estás seguro de que quieres ELIMINAR todos los datos en Supabase y reemplazarlos? (s/n): `
  );

  if (!confirmed) {
    console.log('\n❌ Operación cancelada por el usuario');
    process.exit(0);
  }

  console.log('\n🗑️  Procediendo con la eliminación y sincronización...\n');

  // ═══════════════════════════════════════════════════════════════════════
  // 4. ELIMINAR todos los datos existentes en Supabase
  // ═══════════════════════════════════════════════════════════════════════
  
  console.log('🗑️  Eliminando datos existentes en Supabase...');

  // Delete setlist_songs (must be deleted first due to foreign keys)
  const { error: deleteSetlistSongsError } = await supabase
    .from('setlist_songs')
    .delete()
    .neq('setlist_id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (deleteSetlistSongsError) {
    console.error('   ❌ Error eliminando setlist_songs:', deleteSetlistSongsError.message);
  } else {
    console.log('   ✅ setlist_songs eliminados');
  }

  // Delete setlists
  const { error: deleteSetlistsError } = await supabase
    .from('setlists')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (deleteSetlistsError) {
    console.error('   ❌ Error eliminando setlists:', deleteSetlistsError.message);
  } else {
    console.log('   ✅ setlists eliminados');
  }

  // Delete scenes (must be deleted before songs due to foreign keys)
  const { error: deleteScenesError } = await supabase
    .from('scenes')
    .delete()
    .neq('song_id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (deleteScenesError) {
    console.error('   ❌ Error eliminando scenes:', deleteScenesError.message);
  } else {
    console.log('   ✅ scenes eliminados');
  }

  // Delete songs
  const { error: deleteSongsError } = await supabase
    .from('songs')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (deleteSongsError) {
    console.error('   ❌ Error eliminando songs:', deleteSongsError.message);
  } else {
    console.log('   ✅ songs eliminados');
  }

  console.log('\n✅ Todos los datos eliminados de Supabase\n');

  // ═══════════════════════════════════════════════════════════════════════
  // 5. INSERTAR canciones y escenas desde datos locales
  // ═══════════════════════════════════════════════════════════════════════

  console.log('🎵 Insertando canciones desde datos locales...');

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
      .insert(songData);

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
        .insert(sceneData);

      if (sceneError) {
        console.error(`   ❌ Error insertando escena ${i} de ${song.name}:`, sceneError.message);
      }
    }

    console.log(`   ✅ ${song.name} (${song.scenes.length} escenas)`);
  }

  console.log(`\n✅ ${songs.length} canciones insertadas\n`);

  // ═══════════════════════════════════════════════════════════════════════
  // 6. INSERTAR setlists desde datos locales
  // ═══════════════════════════════════════════════════════════════════════

  console.log('📋 Insertando setlists desde datos locales...');

  for (const setlist of setlists) {
    // Insertar setlist
    // Si no tiene eventDate, usar fecha actual como placeholder
    const setlistData = {
      id: setlist.id,
      name: setlist.name,
      event_date: setlist.eventDate || new Date().toISOString().split('T')[0]
    };

    const { error: setlistError } = await supabase
      .from('setlists')
      .insert(setlistData);

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
        .insert(relationData);

      if (relationError) {
        console.error(`   ❌ Error insertando canción ${songId} en setlist:`, relationError.message);
      }
    }

    console.log(`   ✅ ${setlist.name} (${setlist.songs.length} canciones)`);
  }

  console.log(`\n✅ ${setlists.length} setlists insertados\n`);

  // ═══════════════════════════════════════════════════════════════════════
  // 7. Verificar sincronización
  // ═══════════════════════════════════════════════════════════════════════

  console.log('🔍 Verificando sincronización...');

  const { count: songsCount } = await supabase
    .from('songs')
    .select('*', { count: 'exact', head: true });

  const { count: scenesCount } = await supabase
    .from('scenes')
    .select('*', { count: 'exact', head: true });

  const { count: setlistsCount } = await supabase
    .from('setlists')
    .select('*', { count: 'exact', head: true });

  const { count: setlistSongsCount } = await supabase
    .from('setlist_songs')
    .select('*', { count: 'exact', head: true });

  console.log(`   ✅ ${songsCount} canciones en Supabase`);
  console.log(`   ✅ ${scenesCount} escenas en Supabase`);
  console.log(`   ✅ ${setlistsCount} setlists en Supabase`);
  console.log(`   ✅ ${setlistSongsCount} relaciones setlist-songs en Supabase\n`);

  console.log('🎉 ¡Sincronización completada exitosamente!');
  console.log('📊 Los datos locales ahora están en Supabase\n');
}

syncLocalToSupabase().catch(console.error);

