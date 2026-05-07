// Must be first — catches synchronous errors thrown outside request cycle
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// TEST: Uncomment the line below to test uncaughtException handling, then re-comment it
// console.log(undefinedVariable);

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// Fail fast if required env vars are missing
if (!process.env.JWT_SECRET) {
  console.log('FATAL: JWT_SECRET environment variable is not set. Server cannot start.');
  process.exit(1);
}

const connectDB = require('./db');

const app = require('./app');

const port = process.env.PORT || 3000;
let server;

connectDB()
  .then(() => {
    server = app.listen(port, () => {
      console.log(`App running on port ${port} in ${process.env.NODE_ENV} mode...`);
    });
  })
  .catch(err => {
    console.log('DATABASE CONNECTION ERROR! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
  });

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  if (!server) {
    process.exit(1);
  }
  server.close(() => process.exit(1));
});
