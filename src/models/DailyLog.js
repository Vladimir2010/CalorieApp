const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String, // Storing as YYYY-MM-DD for easy querying
        required: true
    },
    entries: [{
        food: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food',
            required: true
        },
        foodName: { type: String }, // Snapshot of name in case food is deleted
        mealType: {
            type: String,
            enum: ['breakfast', 'lunch', 'dinner', 'snack'],
            default: 'snack'
        },
        quantity: { type: Number, required: true }, // Multiplier of serving size or grams
        calories: { type: Number },
        protein: { type: Number },
        carbs: { type: Number },
        fat: { type: Number }
    }],
    totals: {
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fat: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

// Ensure one log per user per day
dailyLogSchema.index({ user: 1, date: 1 }, { unique: true });

// Pre-save hook to recalculate totals
dailyLogSchema.pre('save', function () {
    this.totals = this.entries.reduce((acc, entry) => {
        acc.calories += entry.calories || 0;
        acc.protein += entry.protein || 0;
        acc.carbs += entry.carbs || 0;
        acc.fat += entry.fat || 0;
        return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
});

module.exports = mongoose.model('DailyLog', dailyLogSchema);
