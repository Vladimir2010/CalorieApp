const express = require('express');
const router = express.Router();
const { getDailyLog, addEntry, removeEntry } = require('../controllers/logController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/:date', protect, getDailyLog);
router.post('/', protect, addEntry);
router.delete('/:date/:entryId', protect, removeEntry);

module.exports = router;
