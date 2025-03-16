const express = require('express');
const { getSolution, addSolution } = require('../controllers/solutionController');

const router = express.Router();

router
  .route('/')
  .post(addSolution);

router
  .route('/:contestId')
  .get(getSolution);

module.exports = router;