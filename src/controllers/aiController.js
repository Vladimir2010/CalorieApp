const fs = require('fs');
const path = require('path');
const { analyzeImage } = require('../services/aiService');
const ImageRecognition = require('../models/ImageRecognition');

// @desc    Upload image and analyze food
// @route   POST /api/ai/analyze
// @access  Private
const analyzeFoodImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        const filePath = req.file.path;

        // 1. Call AI Service
        const analysisResult = await analyzeImage(filePath);

        // 2. Log the interaction to DB
        const log = new ImageRecognition({
            user: req.user._id,
            imageUrl: filePath, // In prod, this would be an S3 URL
            detectedFoods: [{
                name: analysisResult.name,
                calories: analysisResult.calories,
                confidence: analysisResult.confidence || 0
            }],
            rawResponse: analysisResult
        });
        await log.save();

        // 3. Return result to client so they can confirm/add to log
        res.json({
            success: true,
            data: analysisResult,
            logId: log._id
        });

        // Optional: Delete local file after processing to save space (if not needing it served)
        // fs.unlinkSync(filePath); 

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { analyzeFoodImage };
