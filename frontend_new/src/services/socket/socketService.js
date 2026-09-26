// socketService.js - Socket.IO real-time client abstraction for Urban Net

import { io } from 'socket.io-client';

let socket = null;
let simulatedTimer = null;

/**
 * Initialize real-time Socket.IO connection or mock event stream generator.
 */
export function initSocket({ onNewEvent, onUpdatedEvent, onUpdatedBus, isMock = true, socketUrl = 'http://localhost:5000' }) {
  if (!isMock) {
    socket = io(socketUrl, {
      transports: ['websocket'],
      autoConnect: true
    });

    socket.on('connect', () => {
      console.log('[Socket.IO] Connected to Urban Net Central Server:', socket.id);
    });

    socket.on('event:new', (eventData) => {
      if (onNewEvent) onNewEvent(eventData);
    });

    socket.on('event:updated', (eventData) => {
      if (onUpdatedEvent) onUpdatedEvent(eventData);
    });

    socket.on('bus:updated', (busData) => {
      if (onUpdatedBus) onUpdatedBus(busData);
    });

    socket.on('disconnect', () => {
      console.warn('[Socket.IO] Disconnected from Central Server');
    });
    return;
  }

  // --- MOCK REAL-TIME SIMULATION STREAM ---
  // Periodically emit simulated edge events every 25 seconds for realistic live experience
  if (simulatedTimer) clearInterval(simulatedTimer);

  let mockCount = 1016;

  simulatedTimer = setInterval(() => {
    const categories = ['ROAD', 'SAFETY', 'INFRASTRUCTURE', 'TRAFFIC'];
    const types = ['POTHOLE', 'VEHICLE_ACCIDENT', 'WATERLOGGING', 'TRAFFIC_CONGESTION', 'STREETLIGHT_DEFECT'];
    const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const busIds = ['BUS-101', 'BUS-104', 'BUS-109', 'BUS-112', 'BUS-115'];

    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
    const randomBus = busIds[Math.floor(Math.random() * busIds.length)];

    const simulatedEvent = {
      observationId: `EVT-2026-${mockCount++}`,
      busId: randomBus,
      category: randomCategory,
      type: randomType,
      handling: randomSeverity === 'CRITICAL' ? 'REAL_TIME' : 'PERSISTENT',
      severity: randomSeverity,
      confidence: parseFloat((0.85 + Math.random() * 0.14).toFixed(2)),
      location: {
        lat: 28.55 + Math.random() * 0.12,
        lng: 77.12 + Math.random() * 0.16,
        address: `Live Edge Stream Detection near Corridor #${Math.floor(Math.random() * 20 + 1)}, Delhi`
      },
      capturedAt: new Date().toISOString(),
      status: 'NEW',
      evidence: {
        imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80'
      },
      model: 'YOLOv8-EdgeVision-Live',
      detectionCount: 1,
      detectedBy: [randomBus],
      firstDetectedAt: new Date().toISOString(),
      lastDetectedAt: new Date().toISOString()
    };

    if (onNewEvent) {
      onNewEvent(simulatedEvent);
    }
  }, 25000); // 25s interval
}

/**
 * Disconnect socket and clear simulation timers.
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  if (simulatedTimer) {
    clearInterval(simulatedTimer);
    simulatedTimer = null;
  }
}
