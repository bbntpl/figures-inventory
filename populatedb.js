const mongoose = require('mongoose');
const { populateDbThenClose } = require('./utils/util_helper');

// Import and use the connection from your main application
const app = require('./app');

// Run the populateDbThenClose() when the connection is ready
mongoose.connection.once('open', async () => {
  console.log('Connection is open, running the populateDbThenClose...');
  try {
    await populateDbThenClose();
  } catch (err) {
    console.error('Error while populating the database:', err);
  }
});