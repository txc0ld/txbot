import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

const STORAGE_DIR = join(process.cwd(), "data");
const REPLIED_TWEETS_FILE = join(STORAGE_DIR, "replied-tweets.json");

// Ensure storage directory exists
async function ensureStorageExists() {
  if (!existsSync(STORAGE_DIR)) {
    mkdirSync(STORAGE_DIR, { recursive: true });
  }

  if (!existsSync(REPLIED_TWEETS_FILE)) {
    await writeFile(REPLIED_TWEETS_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

// Get the list of tweet IDs we've already replied to
export async function getRepliedTweetIds(): Promise<string[]> {
  await ensureStorageExists();

  try {
    const data = await readFile(REPLIED_TWEETS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading replied tweets file:", error);
    return [];
  }
}

// Check if we've already replied to a tweet
export async function hasRepliedToTweet(tweetId: string): Promise<boolean> {
  const repliedTweets = await getRepliedTweetIds();
  return repliedTweets.includes(tweetId);
}

// Mark a tweet as replied
export async function markTweetAsReplied(tweetId: string): Promise<void> {
  await ensureStorageExists();

  const repliedTweets = await getRepliedTweetIds();

  if (!repliedTweets.includes(tweetId)) {
    repliedTweets.push(tweetId);
    await writeFile(
      REPLIED_TWEETS_FILE,
      JSON.stringify(repliedTweets, null, 2),
      "utf-8"
    );
  }
}
