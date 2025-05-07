import { openai } from "@ai-sdk/openai";
import { CoreMessage, streamText } from "ai";
import dotenv from "dotenv";
import * as readline from "node:readline/promises";
import { allTools } from "./tools/all-tools.js";
import { systemPrompt } from "./const/system-prompt.js";

dotenv.config();

interface ToolResult {
  result?: {
    message?: string;
  };
}

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const messages: CoreMessage[] = [];

async function main() {
  while (true) {
    const userInput = await terminal.question("You: ");

    messages.push({ role: "user", content: userInput });

    const result = streamText({
      system: systemPrompt,
      model: openai("gpt-4o-mini"),
      messages,
      tools: allTools,
      onStepFinish: (step) => {
        console.log(
          `Performing step with tool calls: 
            ${step.toolCalls
              .map((t) => `\n${t.toolName}: ${JSON.stringify(t.args)}`)
              .join(", ")}`
        );
      },
      maxSteps: 10,
    });

    let fullResponse = "";
    process.stdout.write("\nAssistant: ");

    // First handle the text stream
    for await (const delta of result.textStream) {
      fullResponse += delta;
      process.stdout.write(delta);
    }

    const toolResults = (await result.toolResults) as ToolResult[];

    if (toolResults.length > 0) {
      for (const toolResult of toolResults) {
        const message = toolResult.result?.message;
        if (message) {
          process.stdout.write("\n\n" + message);
          fullResponse += "\n\n" + message;
        }
      }
    }

    process.stdout.write("\n\n");
    messages.push({ role: "assistant", content: fullResponse });
  }
}

main().catch(console.error);
