import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// API Key check moved to runtime


export async function askAI(prompt) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key missing. Please restart and enter your key.");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const res = await axios.post(url, {
        contents: [{ parts: [{ text: prompt }] }]
    });

    return res.data.candidates[0].content.parts[0].text;
}
