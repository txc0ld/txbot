import { Scraper } from "agent-twitter-client";
import fs from "fs";
import path from "path";

const COOKIE_PATH = path.join(process.cwd(), "twitter-cookies.json");

/** TODO Cookies */
export default async function postTweet(
  tweet: string,
  txHash: `0x${string}` | null
) {
  const scraper = new Scraper();
  const isLoggedIn = await scraper.isLoggedIn();

  if (!isLoggedIn) {
    await loginWithCredentials(scraper);
  }

  return await postTweetWithReceiptReply(scraper, tweet, txHash);
}

async function postTweetWithReceiptReply(
  scraper: Scraper,
  tweet: string,
  txHash: `0x${string}` | null
) {
  const tweetOne = await scraper.sendTweet(tweet);

  if (!txHash) {
    return tweetOne;
  }

  console.log(tweetOne);

  const tweetOneData = await tweetOne.json();

  console.log(tweetOneData?.data?.create_tweet);

  // Post Abscan link to the tweet as a reply
  const tweetTwo = await scraper.sendTweet(
    `https://abscan.org/tx/${txHash}`,
    tweetOneData?.data?.create_tweet?.tweet_results?.result?.rest_id
  );
  return tweetTwo;
}

async function loginWithCredentials(scraper: Scraper) {
  await scraper.login(
    process.env.TWITTER_USERNAME!,
    process.env.TWITTER_PASSWORD!
  );
}
