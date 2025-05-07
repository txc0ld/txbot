import { tool } from "ai";
import { z } from "zod";
import koalaKoinToss from "../onchain/games/koalaKoinToss.js";

export const koalaKoinTossTool = tool({
  description: "Play a game of Koala Koin Toss game.",
  parameters: z.object({
    gameId: z.number().describe("The game ID to play. 7 is the default game."),
    betAmount: z
      .bigint()
      .describe("The amount to bet. 0.0001 ETH is the default bet amount."),
  }),
  execute: async ({ gameId, betAmount }) => {
    await koalaKoinToss(gameId, betAmount);
  },
});
