const express = require('express');
const { getBookmarks, addBookmark, removeBookmark } = require('../controllers/bookmarkController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all bookmark routes
router.use(protect);

router
  .route('/')
  .get(getBookmarks)
  .post(addBookmark);

router
  .route('/:contestId')
  .delete(removeBookmark);

module.exports = router;