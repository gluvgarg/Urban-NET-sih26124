require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./sockets/socket');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to MongoDB Atlas
    console.log('[Server] Connecting to MongoDB...');
    await connectDB();

    // 2. Create HTTP Server
    const server = http.createServer(app);

    // 3. Initialize Socket.IO
    initSocket(server, process.env.CLIENT_URL);

    // 4. Start Listening ONLY after DB connection succeeds
    server.listen(PORT, () => {
      console.log(`==================================================`);
      console.log(` Urban Net Backend running on port ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(` Socket.IO active for real-time updates`);
      console.log(` Database: ${process.env.DB_NAME || 'urban_net'}`);
      console.log(`==================================================`);
    });

  } catch (error) {
    console.error('[Fatal Error] Could not start server:', error.message);
    process.exit(1);
  }
};

startServer();
