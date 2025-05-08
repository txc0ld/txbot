import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import dotenv from "dotenv";
import * as readline from "node:readline/promises";
import { allTools } from "./tools/all-tools.js";
import { systemPrompt } from "./const/system-prompt.js";
import { logger } from "./utils/logger.js";
import { mkdir } from "fs/promises";
import { join } from "path";

dotenv.config();

// Ensure logs directory exists
await mkdir(join(process.cwd(), "logs"), { recursive: true });

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  logger.info("Starting AI interaction session");

  const userInput = await terminal.question("You: ");
  logger.logUserInput(userInput);

  const result = await generateText({
    system: systemPrompt,
    model: openai("gpt-4o-mini"),
    prompt: userInput,
    tools: allTools,
    maxSteps: 25,
    onStepFinish: (step) => {
      console.log(step);
    },
  });

  const {
    finishReason,
    response,
    steps,
    text,
    toolCalls,
    toolResults,
    experimental_output,
    reasoning,
  } = result;

  logger.logAIResponse(text);
  logger.logToolCalls(toolCalls);
  logger.logToolResults(toolResults);
  logger.logReasoning(reasoning);
  logger.logFinishReason(finishReason);
  logger.logSteps(steps);
  logger.logExperimentalOutput(experimental_output);
  logger.logResponse(response);
}

main().catch((error) => {
  logger.error("Fatal error occurred", {
    error: error.message,
    stack: error.stack,
  });
  console.error(error);
});
