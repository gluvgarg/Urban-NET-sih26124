const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || 'urban_net';

  if (!mongoURI) {
    const errorMsg = 'MONGODB_URI environment variable is not defined!';
    console.error(`[DB Error] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      dbName: dbName
    });

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, DB: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error] Failed to connect: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
