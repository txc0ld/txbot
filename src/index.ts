import { streamText } from "ai";
import dotenv from "dotenv";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { openai } from "@ai-sdk/openai";
import { CoreMessage } from "ai";
import { google } from "@ai-sdk/google";
import createUserPrompt, { systemPrompt } from "./prompt/prompts.js";
import {
  twitterSystemPrompt,
  twitterUserPrompt,
} from "./prompt/twitterPrompts.js";
import {
  executorSystemPrompt,
  executorUserPrompt,
} from "./prompt/executorPrompts.js";
import postTweet from "./tools/twitter/post-tweet.js";
import { executeSwapTool } from "./tools/execute-swap.js";

dotenv.config();

// Ensure logs directory exists
await mkdir(join(process.cwd(), "logs"), { recursive: true });

const messages: CoreMessage[] = [];
const executorMessages: CoreMessage[] = [];
const twitterMessages: CoreMessage[] = [];

async function processTradeDecisionToExecution(
  tradeDecision: string
): Promise<string> {
  try {
    executorMessages.push({ role: "system", content: executorSystemPrompt });
    executorMessages.push({
      role: "user",
      content: `${executorUserPrompt}
${tradeDecision}
`,
    });

    const executorResult = streamText({
      model: openai("gpt-4o-mini"),
      messages: executorMessages,
      tools: {
        executeSwapTool,
      },
      maxSteps: 3,
    });

    let fullResponse = "";
    console.log("\nProcessing trade decision for execution...");
    for await (const delta of executorResult.textStream) {
      fullResponse += delta;
      process.stdout.write(delta);
    }

    process.stdout.write("\n\n");

    return `${fullResponse}`;
  } catch (error) {
    console.error("Error processing trade decision:", error);
    return tradeDecision;
  }
}

async function processTradeDecisionToTweet(
  tradeDecision: string
): Promise<string> {
  try {
    twitterMessages.push({ role: "system", content: twitterSystemPrompt });
    twitterMessages.push({
      role: "user",
      content: `${twitterUserPrompt}
<trade_decision>
${tradeDecision}
</trade_decision>

Your Tweet:
`,
    });

    const tweetResult = streamText({
      model: google("gemini-2.5-flash-preview-04-17"),
      messages: twitterMessages,
    });

    let tweetContent = "";
    console.log("\nGenerating tweet...");
    for await (const delta of tweetResult.textStream) {
      tweetContent += delta;
      process.stdout.write(delta);
    }

    // Add logic to handle tweets that are too long
    if (tweetContent.length > 280) {
      console.log(
        `\nTweet too long (${tweetContent.length} chars). Shortening...`
      );

      // Simple shortening logic:
      // 1. First try to remove any URLs if they exist at the end
      let shortened = tweetContent.replace(/https?:\/\/\S+$/, "").trim();

      // 2. If still too long, truncate and add ellipsis
      if (shortened.length > 277) {
        // Find a good breaking point - preferably at end of a sentence
        const lastPeriod = shortened.lastIndexOf(".", 270);
        const lastQuestion = shortened.lastIndexOf("?", 270);
        const lastExclamation = shortened.lastIndexOf("!", 270);

        let breakPoint = Math.max(lastPeriod, lastQuestion, lastExclamation);

        // If no good sentence break found, try breaking at a space
        if (breakPoint < 0 || breakPoint < 240) {
          breakPoint = shortened.lastIndexOf(" ", 277);
        }

        // If still no good break point, just truncate
        if (breakPoint > 0) {
          shortened = shortened.substring(0, breakPoint + 1) + "...";
        } else {
          shortened = shortened.substring(0, 277) + "...";
        }
      }

      console.log(
        `\nShortened tweet (${shortened.length} chars):\n${shortened}`
      );
      tweetContent = shortened;
    }

    console.log("\nTweet generated:");
    console.log(tweetContent);

    return tweetContent;
  } catch (error) {
    console.error("Error generating tweet:", error);
    return "Error generating tweet";
  }
}

async function main() {
  try {
    const currentStatePrompt = await createUserPrompt();

    // Write the prompt to a file for inspection with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const promptFilePath = join(
      process.cwd(),
      "logs",
      `current_state_prompt_${timestamp}.txt`
    );
    await writeFile(promptFilePath, currentStatePrompt, "utf-8");
    console.log(`Current state prompt written to ${promptFilePath}`);

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

    // Step 2: Process the trade decision through the executor agent
    let executionResult: string | null = null;
    try {
      executionResult = await processTradeDecisionToExecution(fullResponse);
    } catch (error) {
      console.error("Error processing trade decision:", error);
      executionResult = null;
    }

    if (
      executionResult?.includes("CANNOT_EXECUTE") ||
      !executionResult?.startsWith("0x")
    ) {
      console.log("Cannot execute trade decision");
      executionResult = null;
    }

    // Step 3: Generate tweet based on trade decision and execution result
    const tweet = await processTradeDecisionToTweet(fullResponse);

    await postTweet(tweet, executionResult as `0x${string}` | null);
  } catch (error) {
    console.error("Error in main loop:", error);
  }
}

// Run main function if this is the entry point
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
