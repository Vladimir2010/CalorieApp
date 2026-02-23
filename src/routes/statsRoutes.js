const express = require('express');
const router = express.Router();
const { getWeeklyStats, getDashboardSummary } = require('../controllers/statsController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/weekly', protect, getWeeklyStats);
router.get('/summary', protect, getDashboardSummary);

module.exports = router;
