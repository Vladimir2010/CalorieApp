const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");
const fs = require('fs');

// Mock Database for Simulation
const MOCK_PREDICTIONS = [
    { name: 'Grilled Chicken Salad', calories: 350, protein: 30, carbs: 10, fat: 15 },
    { name: 'Pepperoni Pizza', calories: 285, protein: 12, carbs: 36, fat: 10 },
    { name: 'Avocado Toast', calories: 220, protein: 6, carbs: 20, fat: 18 },
    { name: 'Salmon and Rice', calories: 500, protein: 40, carbs: 45, fat: 12 },
    { name: 'Oatmeal with Berries', calories: 150, protein: 5, carbs: 27, fat: 3 }
];

const analyzeImage = async (filePath) => {
    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;

    // 1. Try Groq (Vision Models)
    if (groqKey) {
        try {
            const groq = new Groq({ apiKey: groqKey });
            const base64Image = fs.readFileSync(filePath).toString('base64');

            const groqModels = [
                "meta-llama/llama-4-scout-17b-16e-instruct",
                "meta-llama/llama-4-maverick-17b-128e-instruct"
            ];

            let completion;
            let successfulGroqModel = "";

            for (const modelName of groqModels) {
                try {
                    console.log(`--- Calling Groq AI (${modelName}) ---`);
                    completion = await groq.chat.completions.create({
                        messages: [
                            {
                                role: "user",
                                content: [
                                    { type: "text", text: "Analyze this food image. Provide a JSON object with: name, calories, protein, carbs, fat. Format: {\"name\": \"...\", \"calories\": 0, \"protein\": 0, \"carbs\": 0, \"fat\": 0}. Return ONLY JSON." },
                                    {
                                        type: "image_url",
                                        image_url: { url: `data:image/jpeg;base64,${base64Image}` },
                                    },
                                ],
                            },
                        ],
                        model: modelName,
                    });
                    if (completion) {
                        successfulGroqModel = modelName;
                        break;
                    }
                } catch (e) {
                    console.warn(`⚠️ Groq ${modelName} failed:`, e.message);
                    continue;
                }
            }

            if (completion) {
                const responseText = completion.choices[0].message.content;
                console.log(`✅ Groq (${successfulGroqModel}) Response:`, responseText);

                const jsonMatch = responseText.match(/\{.*\}/s);
                const analysis = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

                return {
                    ...analysis,
                    confidence: 0.92,
                    message: `Success: Analyzed with Groq (${successfulGroqModel}).`
                };
            }
        } catch (groqError) {
            console.warn('⚠️ All Groq Vision Models Failed:', groqError.message);
        }
    }

    // 2. Fallback to Gemini
    if (geminiKey && geminiKey !== 'your_openai_api_key_here') {
        try {
            const genAI = new GoogleGenerativeAI(geminiKey);
            const modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];

            const imageBuffer = fs.readFileSync(filePath);
            const imageData = {
                inlineData: { data: imageBuffer.toString("base64"), mimeType: "image/jpeg" },
            };
            const prompt = "Analyze this food image. Provide a JSON object with: name, calories, protein, carbs, fat. Return ONLY JSON.";

            for (const modelName of modelsToTry) {
                try {
                    console.log(`--- Calling Gemini AI (${modelName}) ---`);
                    const model = genAI.getGenerativeModel({ model: modelName });
                    const result = await model.generateContent([prompt, imageData]);
                    const responseText = result.response.text();

                    const jsonMatch = responseText.match(/\{.*\}/s);
                    const analysis = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

                    return {
                        ...analysis,
                        confidence: 0.95,
                        message: `Success: Analyzed with Gemini (${modelName}).`
                    };
                } catch (e) { continue; }
            }
        } catch (err) {
            console.error('❌ Gemini Fallback Failed:', err.message);
        }
    }

    // 3. Final Fallback: Simulation
    console.log('⚠️ AI Providers Failed. Using Simulation mode.');
    return simulateAnalysis();
};

const simulateAnalysis = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const randomFood = MOCK_PREDICTIONS[Math.floor(Math.random() * MOCK_PREDICTIONS.length)];
            resolve({
                ...randomFood,
                confidence: 0.85 + Math.random() * 0.14,
                message: "SIMULATED: No active AI API (using realistic demo data)."
            });
        }, 1500);
    });
};

module.exports = { analyzeImage };
