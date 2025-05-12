import { streamText } from "ai";
import dotenv from "dotenv";
import { allTools } from "./tools/all-tools.js";
import { mkdir } from "fs/promises";
import { join } from "path";
import { openai } from "@ai-sdk/openai";
import { CoreMessage } from "ai";
import { google } from "@ai-sdk/google";
import createUserPrompt, { systemPrompt } from "./prompt/prompts.js";

dotenv.config();

// Ensure logs directory exists
await mkdir(join(process.cwd(), "logs"), { recursive: true });

const messages: CoreMessage[] = [];

async function main() {
  try {
    const currentStatePrompt = await createUserPrompt();

    console.log("Current State Prompt:", currentStatePrompt);

    messages.push({ role: "user", content: currentStatePrompt });

    const result = streamText({
      system: systemPrompt,
      // model: google("gemini-2.5-flash-preview-04-17"),
      model: openai("gpt-4o-mini"),
      messages,
    });

    let fullResponse = "";
    process.stdout.write("\nAssistant: ");
    for await (const delta of result.textStream) {
      fullResponse += delta;
      process.stdout.write(delta);
    }

    process.stdout.write("\n\n");

    messages.push({ role: "assistant", content: fullResponse });
  } catch (error) {
    console.error("Error in main loop:", error);
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
