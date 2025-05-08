import { streamText } from "ai";
import dotenv from "dotenv";
import * as readline from "node:readline/promises";
import { allTools } from "./tools/all-tools.js";
import { systemPrompt } from "./const/system-prompt.js";
import { logger } from "./utils/logger.js";
import { mkdir } from "fs/promises";
import { join } from "path";
import { openai } from "@ai-sdk/openai";
import { CoreMessage } from "ai";
import { createUserPrompt } from "./prompt/createUserPrompt.js";

dotenv.config();

// Ensure logs directory exists
await mkdir(join(process.cwd(), "logs"), { recursive: true });

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const messages: CoreMessage[] = [];

async function main() {
  while (true) {
    try {
      // Step a: Generate current state prompt (User (really, this program) sends the Agent message)
      const currentStatePrompt = await createUserPrompt();
      messages.push({ role: "user", content: currentStatePrompt });

      // Step b: Get AI response (The LLM responds back to the User/ this program)
      const result = streamText({
        system: systemPrompt,
        model: openai("gpt-4o-mini"),
        messages,
        tools: allTools,
        maxSteps: 25,
      });

      // Step c: Process AI response (The Agent's suggested actions)
      let fullResponse = "";
      process.stdout.write("\nAssistant: ");
      for await (const delta of result.textStream) {
        fullResponse += delta;
        process.stdout.write(delta);
      }
      process.stdout.write("\n\n");

      // Log tool calls and results
      console.log("Tool Calls:", await result.toolCalls);
      console.log("Tool Results:", await result.toolResults);
      messages.push({ role: "assistant", content: fullResponse });

      // Step d: Create evaluator prompt and get execution decision
      const evaluatorPrompt = `
You are an evaluator for an AI agent's decisions. Your job is to:

1. Review the agent's suggested actions below
2. Validate if the actions are safe and appropriate
3. Execute the actions if they pass validation

The agent's response:
${fullResponse}

Please evaluate this response and execute any valid actions. If you find any issues, explain why and suggest alternatives.
`;

      const evaluationResult = streamText({
        system: systemPrompt,
        model: openai("gpt-4o-mini"),
        messages: [...messages, { role: "user", content: evaluatorPrompt }],
        tools: allTools,
        maxSteps: 25,
      });

      // Step e: Process evaluator's response and execute actions
      let evaluationResponse = "";
      process.stdout.write("\nEvaluator: ");
      for await (const delta of evaluationResult.textStream) {
        evaluationResponse += delta;
        process.stdout.write(delta);
      }
      process.stdout.write("\n\n");

      // Log evaluator's tool calls and results
      console.log("Evaluator Tool Calls:", await evaluationResult.toolCalls);
      console.log(
        "Evaluator Tool Results:",
        await evaluationResult.toolResults
      );

      // Step f: Wait for blockchain state to update
      await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 second delay
    } catch (error) {
      console.error(error);
    }
  }
}

main().catch((error) => {
  console.error(error);
});
