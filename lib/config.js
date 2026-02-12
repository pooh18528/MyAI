import fs from "fs";
import path from "path";
import readline from "readline";
import chalk from "chalk";
import dotenv from "dotenv";

export async function checkApiKey() {
    dotenv.config();

    const currentKey = process.env.GEMINI_API_KEY;
    const isPlaceholder = currentKey === "PLACE_YOUR_API_KEY_HERE" || currentKey === "your_api_key_here";

    if (currentKey && currentKey.length > 10 && !isPlaceholder) {
        return;
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        console.log(chalk.yellow("\n🔑 API Key missing!"));
        console.log("Get it free here: https://aistudio.google.com/app/apikey");

        rl.question(chalk.green("\nEnter your Gemini API Key: "), (key) => {
            const apiKey = key.trim();

            if (!apiKey) {
                console.log(chalk.red("❌ API Key is required to use this tool."));
                process.exit(1);
            }

            const envPath = path.resolve(process.cwd(), ".env");
            fs.writeFileSync(envPath, `GEMINI_API_KEY=${apiKey}\n`);

            process.env.GEMINI_API_KEY = apiKey;
            console.log(chalk.green("✅ API Key saved successfully!\n"));

            rl.close();
            resolve();
        });
    });
}
