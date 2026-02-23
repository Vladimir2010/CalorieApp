const mongoose = require('mongoose');

const imageRecognitionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    detectedFoods: [{
        name: String,
        calories: Number,
        confidence: Number
    }],
    rawResponse: {
        type: Object // Store full JSON response for debugging/analysis
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ImageRecognition', imageRecognitionSchema);
