import { Scraper } from "agent-twitter-client";
import fs from "fs";
import path from "path";

const COOKIE_PATH = path.join(process.cwd(), "twitter-cookies.json");

export default async function postTweet(tweet: string) {
  const scraper = new Scraper();

  try {
    // Check if cookies exist and attempt to use them
    let usedCookies = false;
    if (fs.existsSync(COOKIE_PATH)) {
      try {
        const cookiesData = fs.readFileSync(COOKIE_PATH, "utf-8");
        // Parse the cookies array and apply each cookie individually
        const cookies = JSON.parse(cookiesData);

        // The error suggests we need to handle the cookies differently
        // Let's use the cookies array that allows us to recreate the session
        if (Array.isArray(cookies)) {
          for (const cookie of cookies) {
            // Ensure each cookie is properly formatted as a string
            // The error states that setCookie expects a Cookie object or string
            if (typeof cookie === "object") {
              await scraper.setCookies([cookie]);
            }
          }
          usedCookies = true;
          console.log("Restored Twitter session from cookies");
        }
      } catch (cookieError: unknown) {
        const error =
          cookieError instanceof Error
            ? cookieError
            : new Error(String(cookieError));
        console.error(
          "Failed to load cookies, will log in normally:",
          error.message
        );
        usedCookies = false;
      }
    }

    if (!usedCookies) {
      // Login normally if no cookies are available or if cookies failed
      console.log("Logging in to Twitter...");
      await scraper.login(
        process.env.TWITTER_USERNAME!,
        process.env.TWITTER_PASSWORD!
      );

      // After login, save the cookies for future use
      try {
        const cookies = await scraper.getCookies();
        fs.writeFileSync(COOKIE_PATH, JSON.stringify(cookies));
        console.log("Saved Twitter session cookies for future use");
      } catch (saveCookieError: unknown) {
        const error =
          saveCookieError instanceof Error
            ? saveCookieError
            : new Error(String(saveCookieError));
        console.error("Failed to save cookies:", error.message);
      }
    }

    // Send the tweet
    return await scraper.sendTweet(tweet);
  } catch (error: any) {
    // Handle session expiry by attempting to log in again
    if (
      error.message?.includes("authentication") ||
      error.message?.includes("login") ||
      error.message?.includes("session")
    ) {
      console.log("Session expired or invalid cookies, logging in again...");
      await scraper.login(
        process.env.TWITTER_USERNAME!,
        process.env.TWITTER_PASSWORD!
      );

      // Save the new cookies
      try {
        const cookies = await scraper.getCookies();
        fs.writeFileSync(COOKIE_PATH, JSON.stringify(cookies));
        console.log("Saved new Twitter session cookies");
      } catch (saveCookieError: unknown) {
        const error =
          saveCookieError instanceof Error
            ? saveCookieError
            : new Error(String(saveCookieError));
        console.error("Failed to save cookies:", error.message);
      }

      // Retry sending the tweet
      return await scraper.sendTweet(tweet);
    }

    // If it's not an authentication error, re-throw it
    throw error;
  }
}
