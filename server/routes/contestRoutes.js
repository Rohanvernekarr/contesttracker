const express = require('express');
const { getContests, getContest } = require('../controllers/contestController');

const router = express.Router();

router
  .route('/')
  .get(getContests);

router
  .route('/:id')
  .get(getContest);

module.exports = router;