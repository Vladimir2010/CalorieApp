const express = require('express');
const router = express.Router();
const upload = require('../utils/multerConfig');
const { analyzeFoodImage } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/analyze', protect, upload.single('image'), analyzeFoodImage);

module.exports = router;
