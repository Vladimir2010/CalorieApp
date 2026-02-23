const DailyLog = require('../models/DailyLog');
const Food = require('../models/Food');

// @desc    Get daily log for a specific date (or today)
// @route   GET /api/logs/:date
// @access  Private
const getDailyLog = async (req, res) => {
    try {
        const date = req.params.date; // Format YYYY-MM-DD
        const log = await DailyLog.findOne({ user: req.user._id, date }).populate('entries.food', 'name brand servingSize');

        if (log) {
            res.json(log);
        } else {
            // Return empty structure if no log exists yet, rather than 404, for better FE handling
            res.json({
                date,
                entries: [],
                totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add food entry to daily log
// @route   POST /api/logs
// @access  Private
const addEntry = async (req, res) => {
    try {
        const { date, foodId, quantity, mealType } = req.body; // quantity in multipliers (e.g. 1.5 servings) or grams if we adjust logic

        // 1. Find the Food
        const foodItem = await Food.findById(foodId);
        if (!foodItem) {
            return res.status(404).json({ message: 'Food not found' });
        }

        // 2. Calculate Macros
        // Assuming quantity is a multiplier of the serving size defined in Food
        // OR: quantity could be grams. Let's assume multiplier for simplicity or grams if specifically handled.
        // Let's implement Quantity as "Number of Servings" for this iteration to be safe.
        // If Food is 100g, and user ate 200g, quantity = 2.

        const entry = {
            food: foodId,
            foodName: foodItem.name,
            mealType,
            quantity,
            calories: Math.round(foodItem.calories * quantity),
            protein: Math.round(foodItem.protein * quantity),
            carbs: Math.round(foodItem.carbs * quantity),
            fat: Math.round(foodItem.fat * quantity)
        };

        // 3. Find or Create DailyLog
        let log = await DailyLog.findOne({ user: req.user._id, date });

        if (!log) {
            log = new DailyLog({
                user: req.user._id,
                date,
                entries: [], // Will push below
            });
        }

        // 4. Add entry
        log.entries.push(entry);

        // 5. Save (triggers pre-save hook for totals)
        await log.save();

        res.status(201).json(log);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove food entry from daily log
// @route   DELETE /api/logs/:date/:entryId
// @access  Private
const removeEntry = async (req, res) => {
    try {
        const { date, entryId } = req.params;

        const log = await DailyLog.findOne({ user: req.user._id, date });

        if (log) {
            log.entries = log.entries.filter(entry => entry._id.toString() !== entryId);
            await log.save();
            res.json(log);
        } else {
            res.status(404).json({ message: 'Log not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDailyLog,
    addEntry,
    removeEntry
};
