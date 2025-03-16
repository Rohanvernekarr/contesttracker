const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const contestRoutes = require('./routes/contestRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const solutionRoutes = require('./routes/solutionRoutes');
const { fetchAllContests } = require('./services/contestFetcher');
const { fetchYoutubeVideos } = require('./services/youtubeService');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/contest-tracker')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use('/api/contests', contestRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/solutions', solutionRoutes);


cron.schedule('0 */6 * * *', async () => {
  console.log('Fetching contests from all platforms...');
  await fetchAllContests();
});


cron.schedule('0 0 * * *', async () => {
  console.log('Fetching solution videos from YouTube...');
  await fetchYoutubeVideos();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});