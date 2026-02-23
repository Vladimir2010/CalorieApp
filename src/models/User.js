const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        age: { type: Number },
        gender: { type: String, enum: ['male', 'female', 'other'] },
        height: { type: Number }, // in cm
        weight: { type: Number }, // in kg
        activityLevel: {
            type: String,
            enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
            default: 'sedentary'
        }
    },
    goals: {
        dailyCalories: { type: Number, default: 2000 },
        protein: { type: Number }, // grams
        carbs: { type: Number }, // grams
        fat: { type: Number } // grams
    }
}, {
    timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate BMR and Calories based on profile updates (simple version)
userSchema.pre('save', function () {
    if (this.isModified('profile')) {
        // Harris-Benedict Equation or similar could be implemented here
        // For now, we will leave this as a placeholder or client-side calculation
        // but ensuring it exists in the backend logic is good practice.
    }
});

module.exports = mongoose.model('User', userSchema);
