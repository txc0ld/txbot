import { generateText, streamText } from "ai";
import dotenv from "dotenv";
import * as readline from "node:readline/promises";
import { allTools } from "./tools/all-tools.js";
import { systemPrompt } from "./const/system-prompt.js";
import { logger } from "./utils/logger.js";
import { mkdir } from "fs/promises";
import { join } from "path";
import { openai } from "@ai-sdk/openai";
import { CoreMessage } from "ai";

dotenv.config();

// Ensure logs directory exists
await mkdir(join(process.cwd(), "logs"), { recursive: true });

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const messages: CoreMessage[] = [];

async function main() {
  logger.info("Starting AI interaction session");

  while (true) {
    const userInput = await terminal.question("You: ");
    logger.logUserInput(userInput);

    messages.push({ role: "user", content: userInput });

    const result = streamText({
      system: systemPrompt,
      model: openai("gpt-4o-mini"),
      messages,
      tools: allTools,
      maxSteps: 25,
      onStepFinish: (step) => {},
    });

    let fullResponse = "";
    process.stdout.write("\nAssistant: ");
    for await (const delta of result.textStream) {
      fullResponse += delta;
      process.stdout.write(delta);
    }
    process.stdout.write("\n\n");

    messages.push({ role: "assistant", content: fullResponse });
  }
}

main().catch((error) => {
  logger.error("Fatal error occurred", {
    error: error.message,
    stack: error.stack,
  });
  console.error(error);
});
