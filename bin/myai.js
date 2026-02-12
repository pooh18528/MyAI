#!/usr/bin/env node
import figlet from "figlet";
import chalk from "chalk";
import readline from "readline";
import { askAI } from "../lib/ai.js";

import { fixFile } from "../lib/fileEditor.js";
import { checkApiKey, deleteApiKey } from "../lib/config.js";

console.clear();
console.log(chalk.cyan(figlet.textSync("MyAI")));
console.log(chalk.yellow("Commands: 'exit' to quit | '/fix <file>' to fix code | '/reset' to clear API Key\n"));

await checkApiKey();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: chalk.green("You > ")
});

rl.prompt();

rl.on("line", async (line) => {
  const text = line.trim();

  // 🗑️ ลบ API Key
  if (text === "/reset") {
    deleteApiKey();
    return;
  }
  if (text.toLowerCase() === "exit") {
    console.log("Bye 👋");
    process.exit(0);
  }

  // 🔧 คำสั่งแก้ไฟล์
  if (text.startsWith("/fix ")) {
    const filePath = text.replace("/fix ", "").trim();
    await fixFile(filePath);
    rl.prompt();
    return;
  }

  try {
    const reply = await askAI(text);
    console.log(chalk.blue("AI > ") + reply + "\n");
  } catch (err) {
    console.log("Error:", err.message);
  }
  rl.prompt();
});
