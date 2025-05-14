import getMentions from "./tools/twitter/get-mentions.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function main() {
  console.log("Starting mention check and reply process...");

  try {
    await getMentions();
    console.log("Process completed successfully");
  } catch (error) {
    console.error("Error in check-and-reply process:", error);
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
