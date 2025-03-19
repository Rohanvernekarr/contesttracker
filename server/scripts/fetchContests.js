const mongoose = require('mongoose');
const { fetchAllContests } = require('../services/contestFetcher');

async function main() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/contest-tracker');
    console.log('Connected to MongoDB');

    // Fetch contests
    console.log('Starting contest fetch...');
    await fetchAllContests();
    console.log('Contest fetch completed successfully');

    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error:', error);
    // Ensure MongoDB connection is closed even if there's an error
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  }
}

main(); 