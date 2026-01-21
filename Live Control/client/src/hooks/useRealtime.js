/**
 * ═══════════════════════════════════════════════════════════════════════
 * REALTIME HOOK - Socket.IO Client
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Hook personalizado para sincronización en tiempo real
 * Escucha cambios del servidor y actualiza el estado automáticamente
 */

import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

/**
 * Hook para sincronización en tiempo real
 * @param {Object} callbacks - Callbacks para eventos
 * @param {Function} callbacks.onSongCreated - Callback cuando se crea una canción
 * @param {Function} callbacks.onSongUpdated - Callback cuando se actualiza una canción
 * @param {Function} callbacks.onSongDeleted - Callback cuando se elimina una canción
 * @param {Function} callbacks.onSetlistCreated - Callback cuando se crea un setlist
 * @param {Function} callbacks.onSetlistUpdated - Callback cuando se actualiza un setlist
 * @param {Function} callbacks.onSetlistDeleted - Callback cuando se elimina un setlist
 * @param {Function} callbacks.onSetlistsReloaded - Callback cuando se recargan todos los setlists
 */
export function useRealtime(callbacks = {}) {
  const socketRef = useRef(null);
  const callbacksRef = useRef(callbacks);

  // Update callbacks ref when they change
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    // Connect to Socket.IO server
    const socket = io({
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('🔌 Conectado al servidor en tiempo real');
    });

    socket.on('disconnect', () => {
      console.log('🔌 Desconectado del servidor');
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión:', error);
    });

    // Song events
    socket.on('song:created', (song) => {
      console.log('🎵 Canción creada:', song.name);
      if (callbacksRef.current.onSongCreated) {
        callbacksRef.current.onSongCreated(song);
      }
    });

    socket.on('song:updated', (song) => {
      console.log('🎵 Canción actualizada:', song.name);
      if (callbacksRef.current.onSongUpdated) {
        callbacksRef.current.onSongUpdated(song);
      }
    });

    socket.on('song:deleted', (data) => {
      console.log('🎵 Canción eliminada:', data.id);
      if (callbacksRef.current.onSongDeleted) {
        callbacksRef.current.onSongDeleted(data.id);
      }
    });

    // Setlist events
    socket.on('setlist:created', (setlist) => {
      console.log('📋 Setlist creado:', setlist.name);
      if (callbacksRef.current.onSetlistCreated) {
        callbacksRef.current.onSetlistCreated(setlist);
      }
    });

    socket.on('setlist:updated', (setlist) => {
      console.log('📋 Setlist actualizado:', setlist.name);
      if (callbacksRef.current.onSetlistUpdated) {
        callbacksRef.current.onSetlistUpdated(setlist);
      }
    });

    socket.on('setlist:deleted', (data) => {
      console.log('📋 Setlist eliminado:', data.id);
      if (callbacksRef.current.onSetlistDeleted) {
        callbacksRef.current.onSetlistDeleted(data.id);
      }
    });

    socket.on('setlists:reloaded', (setlists) => {
      console.log('📋 Setlists recargados');
      if (callbacksRef.current.onSetlistsReloaded) {
        callbacksRef.current.onSetlistsReloaded(setlists);
      }
    });

    // Cleanup on unmount
    return () => {
      console.log('🔌 Cerrando conexión en tiempo real');
      socket.disconnect();
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected || false
  };
}

