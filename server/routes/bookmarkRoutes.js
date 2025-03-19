const express = require('express');
const { getBookmarks, addBookmark, removeBookmark } = require('../controllers/bookmarkController');

const router = express.Router();

router
  .route('/')
  .get(getBookmarks)
  .post(addBookmark);

router
  .route('/:contestId')
  .delete(removeBookmark);

module.exports = router;