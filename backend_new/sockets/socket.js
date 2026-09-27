const { Server } = require('socket.io');

let io = null;

/**
 * Initialize Socket.IO server attached to HTTP server instance
 */
const initSocket = (server, clientUrl) => {
  io = new Server(server, {
    cors: {
      origin: clientUrl || '*',
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Get active Socket.IO server instance
 */
const getIO = () => {
  return io;
};

/**
 * Emit event:new when a brand new event is detected/created
 */
const emitEventNew = (event) => {
  if (io) {
    io.emit('event:new', event);
  }
};

/**
 * Emit event:updated when an existing event is updated or deduplicated
 */
const emitEventUpdated = (event) => {
  if (io) {
    io.emit('event:updated', event);
  }
};

/**
 * Emit bus:updated when bus location, speed or status changes
 */
const emitBusUpdated = (bus) => {
  if (io) {
    io.emit('bus:updated', bus);
  }
};

module.exports = {
  initSocket,
  getIO,
  emitEventNew,
  emitEventUpdated,
  emitBusUpdated
};
