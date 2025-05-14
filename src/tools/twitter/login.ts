import { Scraper } from "agent-twitter-client";
import fs from "fs/promises";
import path from "path";
import "dotenv/config";

const COOKIES_FILE = path.join(process.cwd(), "twitter-cookies.json");

export async function loginTwitter(scraper?: Scraper) {
  if (!scraper) {
    scraper = new Scraper();
  }

  try {
    // Try to load existing cookies first
    try {
      const cookiesData = await fs.readFile(COOKIES_FILE, "utf-8");
      const cookies = JSON.parse(cookiesData);
      await scraper.setCookies(cookies);
      console.log("Loaded existing cookies");
    } catch (error) {
      console.log("No existing cookies found");
    }

    // Check if we're already logged in
    if (await scraper.isLoggedIn()) {
      console.log("Already logged in");
      return scraper;
    }

    // If not logged in, try to login with credentials
    if (
      !process.env.TWITTER_USERNAME ||
      !process.env.TWITTER_PASSWORD ||
      !process.env.TWITTER_EMAIL
    ) {
      throw new Error("Twitter credentials not found in environment variables");
    }

    console.log("Logging in with credentials...");
    await scraper.login(
      process.env.TWITTER_USERNAME,
      process.env.TWITTER_PASSWORD,
      process.env.TWITTER_EMAIL
    );

    // Save cookies for future use
    const cookies = await scraper.getCookies();
    await fs.writeFile(COOKIES_FILE, JSON.stringify(cookies));
    console.log("Saved cookies for future use");

    return scraper;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}
