#!/usr/bin/env node
import figlet from "figlet";
import chalk from "chalk";
import readline from "readline";
import { askAI } from "../lib/ai.js";

import { fixFile } from "../lib/fileEditor.js";
import { checkApiKey } from "../lib/config.js";

console.clear();
console.log(chalk.cyan(figlet.textSync("MyAI")));
console.log(chalk.yellow("Type 'exit' to quit\n"));

await checkApiKey();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: chalk.green("You > ")
});

rl.prompt();

rl.on("line", async (line) => {
  const text = line.trim();
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
