const express = require('express');
const { getBookmarks, addBookmark, removeBookmark } = require('../controllers/bookmarkController');

const router = express.Router();

router
  .route('/')
  .post(addBookmark);

router
  .route('/:userId')
  .get(getBookmarks);

router
  .route('/:userId/:contestId')
  .delete(removeBookmark);

module.exports = router;