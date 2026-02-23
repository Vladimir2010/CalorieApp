const express = require('express');
const router = express.Router();
const { searchFoods, getFoodById, createFood } = require('../controllers/foodController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/search').get(protect, searchFoods);
router.route('/').post(protect, createFood); // Create custom food
router.route('/:id').get(protect, getFoodById);

module.exports = router;
