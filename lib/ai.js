import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function askAI(prompt) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key missing. Please restart and enter your key.");

    // Try the most standard model first
    let modelName = "gemini-2.5-flash";

    try {
        return await generate(modelName, apiKey, prompt);
    } catch (error) {
        // If 404 (Model not found), try to auto-discover a working model
        if (error.response && error.response.status === 404) {
            console.log("⚠️  Default model not found. Auto-switching to available model...");

            try {
                const autoModel = await findValidModel(apiKey);
                if (autoModel) {
                    console.log(`✅ Switched to: ${autoModel}`);
                    return await generate(autoModel, apiKey, prompt);
                }
            } catch (discoveryError) {
                console.error("❌ Auto-discovery failed:", discoveryError.message);
            }
        }

        // Pass through the original error if we couldn't fix it
        if (error.response) {
            console.error("API Error Details:", JSON.stringify(error.response.data, null, 2));
            throw new Error(`API Error: ${error.response.status}`);
        }
        throw error;
    }
}

async function generate(modelName, apiKey, prompt) {
    // Ensure modelName doesn't duplicate 'models/' prefix if already present
    // But standard usage in URL construction usually expects just the ID if we hardcode "models/"
    // Let's use the full resource name from the API for safety

    const cleanModelName = modelName.startsWith("models/") ? modelName : `models/${modelName}`;
    const url = `https://generativelanguage.googleapis.com/v1beta/${cleanModelName}:generateContent?key=${apiKey}`;

    const res = await axios.post(url, {
        contents: [{ parts: [{ text: prompt }] }]
    });
    return res.data.candidates[0].content.parts[0].text;
}

async function findValidModel(apiKey) {
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const res = await axios.get(listUrl);

    const models = res.data.models || [];

    // Prioritize models: flash > pro > others, valid for generation
    const validModel = models.find(m =>
        m.supportedGenerationMethods &&
        m.supportedGenerationMethods.includes("generateContent") &&
        m.name.includes("flash")
    ) || models.find(m =>
        m.supportedGenerationMethods &&
        m.supportedGenerationMethods.includes("generateContent")
    );

    return validModel ? validModel.name : null;
}
