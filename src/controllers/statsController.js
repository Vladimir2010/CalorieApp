const DailyLog = require('../models/DailyLog');

// @desc    Get stats for the last 7 days
// @route   GET /api/stats/weekly
// @access  Private
const getWeeklyStats = async (req, res) => {
    try {
        const today = new Date();
        const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

        // Since we stored date as string 'YYYY-MM-DD', we can rely on standard sorting or use creation time.
        // If we want exact dates, we can query by the 'date' string field if we generate the strings.
        // Or simpler: use createdAt for aggregation which is native Date.
        // Let's use the 'date' field logic assuming consistent format, OR better:

        // Let's just pull the last 7 documents sorted by date descending.
        // This assumes daily usage. For accurate "Calendar" stats, logic might be more complex,
        // but for an academic project, "Last 7 logs" or specific date range query is sufficient.

        const logs = await DailyLog.find({
            user: req.user._id,
            // Optimization: could filter by date string range if we constructed them
        })
            .sort({ date: -1 })
            .limit(7);

        // Format for Chart.js or similar
        const stats = logs.map(log => ({
            date: log.date,
            calories: log.totals.calories,
            protein: log.totals.protein,
            carbs: log.totals.carbs,
            fat: log.totals.fat
        })).reverse(); // specific order for chart

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dashboard summary (averages etc)
// @route   GET /api/stats/summary
// @access  Private
const getDashboardSummary = async (req, res) => {
    try {
        // Simple aggregation to get average calories
        const result = await DailyLog.aggregate([
            { $match: { user: req.user._id } },
            {
                $group: {
                    _id: null,
                    totalCalories: { $sum: "$totals.calories" },
                    avgCalories: { $avg: "$totals.calories" },
                    daysTracked: { $sum: 1 }
                }
            }
        ]);

        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.json({
                totalCalories: 0,
                avgCalories: 0,
                daysTracked: 0
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getWeeklyStats,
    getDashboardSummary
};
