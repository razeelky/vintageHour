const express = require('express');
const {
  getWatches,
  getWatchById,
  createWatch,
  updateWatch,
  deleteWatch,
} = require('../controllers/watchController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getWatches);
router.get('/:id', getWatchById);
router.post('/', protect, authorize('admin'), createWatch);
router.put('/:id', protect, authorize('admin'), updateWatch);
router.delete('/:id', protect, authorize('admin'), deleteWatch);

module.exports = router;
