import fs from "fs";
import { askAI } from "./ai.js";

export async function fixFile(path) {
    if (!fs.existsSync(path)) {
        console.log("❌ File not found:", path);
        return;
    }

    const code = fs.readFileSync(path, "utf8");
    const prompt = `You are a senior software engineer. Fix bugs and improve this code. Return ONLY the fixed code without explanation.
  
  CODE:
  ${code}`;

    console.log("🤖 AI is fixing your code...\n");
    const fixedCode = await askAI(prompt);

    fs.writeFileSync(path, fixedCode);
    console.log("✅ File updated:", path);
}
