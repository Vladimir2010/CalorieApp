const Food = require('../models/Food');

// @desc    Search foods by name
// @route   GET /api/foods/search?query=pizza
// @access  Private
const searchFoods = async (req, res) => {
    try {
        const keyword = req.query.query
            ? {
                name: {
                    $regex: req.query.query,
                    $options: 'i',
                },
            }
            : {};

        const foods = await Food.find({ ...keyword }).limit(20);
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get food by ID
// @route   GET /api/foods/:id
// @access  Private
const getFoodById = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);

        if (food) {
            res.json(food);
        } else {
            res.status(404).json({ message: 'Food not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new custom food
// @route   POST /api/foods
// @access  Private
const createFood = async (req, res) => {
    try {
        const { name, brand, calories, protein, carbs, fat, servingSize } = req.body;

        const food = new Food({
            name,
            brand,
            calories,
            protein,
            carbs,
            fat,
            servingSize,
            isCustom: true,
            createdBy: req.user._id,
        });

        const createdFood = await food.save();
        res.status(201).json(createdFood);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    searchFoods,
    getFoodById,
    createFood,
};
