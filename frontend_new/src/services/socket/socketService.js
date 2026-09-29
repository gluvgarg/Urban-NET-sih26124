// socketService.js - Socket.IO real-time client for Urban Net

import { io } from 'socket.io-client';
import { normalizeEvent, normalizeBus } from '../api/normalizers';

let socket = null;

/**
 * Initialize real-time Socket.IO connection
 */
export function initSocket({ onNewEvent, onUpdatedEvent, onUpdatedBus }) {
  // const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

  const socketUrl =
    import.meta.env.VITE_SOCKET_URL ||
    'https://urban-net-sih26124-backend.onrender.com';
    
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(socketUrl, {
    transports: ['websocket', 'polling'],
    autoConnect: true
  });

  socket.on('connect', () => {
    console.log('[Socket.IO] Connected to Urban Net Central Server:', socket.id);
  });

  socket.on('event:new', (eventData) => {
    console.log('[Socket.IO] event:new received:', eventData);
    if (onNewEvent && eventData) {
      onNewEvent(normalizeEvent(eventData));
    }
  });

  socket.on('event:updated', (eventData) => {
    console.log('[Socket.IO] event:updated received:', eventData);
    if (onUpdatedEvent && eventData) {
      onUpdatedEvent(normalizeEvent(eventData));
    }
  });

  socket.on('bus:updated', (busData) => {
    console.log('[Socket.IO] bus:updated received:', busData);
    if (onUpdatedBus && busData) {
      onUpdatedBus(normalizeBus(busData));
    }
  });

  socket.on('disconnect', () => {
    console.warn('[Socket.IO] Disconnected from Central Server');
  });

  socket.on('connect_error', (err) => {
    console.warn('[Socket.IO] Connection error:', err.message);
  });
}

/**
 * Disconnect socket connection
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
