const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    if (!apiKey) {
        console.error("No API key found in .env");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // The SDK doesn't have a direct 'listModels' helper in the simple way, 
        // but we can try common ones or just run a test.
        console.log("Checking available models for your key...");

        // We'll try a simple generate content call with a few names to see which catch.
        // Or better, we can use the 'listModels' from the rest API if we wanted, 
        // but let's just stick to the SDK and try names.

        const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-pro-vision"];

        for (const m of models) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                // Small test call
                console.log(`Testing ${m}...`);
                await model.generateContent("test");
                console.log(`✅ ${m} is AVAILABLE`);
            } catch (e) {
                console.log(`❌ ${m} is NOT available (${e.message})`);
            }
        }
    } catch (err) {
        console.error("Error checking models:", err.message);
    }
}

listModels();
