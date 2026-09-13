const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const { Server } = require('socket.io');

const config = require('./config');
const initSchema = require('./db/schema');
const getDb = require('./db/connection');
const seedDatabase = require('./db/seed');

// Import Route Handlers
const healthRouter = require('./routes/health');
const dashboardRouter = require('./routes/dashboard');
const busesRouter = require('./routes/buses');
const eventsRouter = require('./routes/events');
const roadConditionsRouter = require('./routes/roadConditions');
const infrastructureRouter = require('./routes/infrastructure');
const trafficRouter = require('./routes/traffic');
const incidentsRouter = require('./routes/incidents');
const mapRouter = require('./routes/map');
const analyticsRouter = require('./routes/analytics');
const aiRouter = require('./routes/ai');
const edgeRouter = require('./routes/edge');
const { generateDemoEvent } = require('./controllers/aiController');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  }
});

app.set('io', io);

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Mount API Routes
app.use('/api/health', healthRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/buses', busesRouter);
app.use('/api/events', eventsRouter);
app.use('/api/road-conditions', roadConditionsRouter);
app.use('/api/infrastructure', infrastructureRouter);
app.use('/api/traffic', trafficRouter);
app.use('/api/incidents', incidentsRouter);
app.use('/api/map', mapRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/edge', edgeRouter);
app.post('/api/demo/generate-event', generateDemoEvent);

// Central Error Handler
app.use(errorHandler);

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);
  
  socket.emit('system:info', {
    message: 'Connected to SIH 2026 Mobile Urban Intelligence Command Socket Server',
    aiMode: config.aiMode
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Initialize DB and Start Server
function start() {
  try {
    initSchema();
    const db = getDb();
    const busCount = db.prepare(`SELECT COUNT(*) as count FROM buses`).get().count;

    if (busCount === 0) {
      console.log('[Init] Database is empty. Seeding initial Delhi NCR demo dataset...');
      seedDatabase();
    }

    server.listen(config.port, '0.0.0.0', () => {
      console.log(`=======================================================`);
      console.log(` SIH 2026 Urban Intelligence Platform Backend Server`);
      console.log(` Mode: ${config.aiMode.toUpperCase()} AI Adapter Enabled`);
      console.log(` REST API: http://localhost:${config.port}/api/health`);
      console.log(` Socket.IO Server: http://localhost:${config.port}`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('[Fatal Error] Server failed to start:', error);
    process.exit(1);
  }
}

start();