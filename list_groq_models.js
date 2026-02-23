const Groq = require("groq-sdk");
require('dotenv').config();

async function listModels() {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    try {
        const response = await groq.models.list();
        const models = response.data.map(m => m.id);
        console.log("Available Groq Models:");
        console.log(JSON.stringify(models, null, 2));
    } catch (err) {
        console.error("Error fetching models:", err.message);
    }
}

listModels();
