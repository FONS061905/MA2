const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.DATABASE) {
    throw new Error('DATABASE environment variable is not set');
  }

  const conn = await mongoose.connect(process.env.DATABASE);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
