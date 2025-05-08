import { streamText } from "ai";
import dotenv from "dotenv";
import { allTools } from "./tools/all-tools.js";
import { systemPrompt } from "./const/system-prompt.js";
import { mkdir } from "fs/promises";
import { join } from "path";
import { openai } from "@ai-sdk/openai";
import { CoreMessage } from "ai";
import { createUserPrompt } from "./prompt/createUserPrompt.js";
import { google } from "@ai-sdk/google";

dotenv.config();

// Ensure logs directory exists
await mkdir(join(process.cwd(), "logs"), { recursive: true });

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
        model: google("gemini-2.5-flash-preview-04-17"),
        messages,
        tools: allTools,
        maxSteps: 10,
        // toolChoice:   "required",
      });

      // Step c: Process AI response (The Agent's suggested actions)
      let fullResponse = "";
      process.stdout.write("\nAssistant: ");
      for await (const delta of result.textStream) {
        fullResponse += delta;
        process.stdout.write(delta);
      }

      console.log(await result.toolCalls);
      console.log(await result.toolResults);

      process.stdout.write("\n\n");

      messages.push({ role: "assistant", content: fullResponse });

      // Step d: Wait for blockchain state to update
      await new Promise((resolve) => setTimeout(resolve, 300000)); // 5 minutes delay
    } catch (error) {
      console.error("Error in main loop:", error);
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });
      }
      // Add a small delay before retrying to prevent rapid error loops
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

main().catch((error) => {
  console.error("Fatal error in main process:", error);
  if (error instanceof Error) {
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
  }
  process.exit(1); // Exit with error code
});
