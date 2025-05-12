import { Scraper } from "agent-twitter-client";

export default async function postTweet(tweet: string) {
  const scraper = new Scraper();
  await scraper.login(
    process.env.TWITTER_USERNAME!,
    process.env.TWITTER_PASSWORD!
  );

  return await scraper.sendTweet(tweet);
}
