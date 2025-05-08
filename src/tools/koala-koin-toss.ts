import { z } from "zod";
import { chain } from "../const/chain.js";
import createAgwClient from "../lib/createAgwClient.js";
import {
  KOALA_KOIN_TOSS_CONTRACT_ADDRESS,
  KOALA_KOIN_TOSS_CONTRACT_ABI,
} from "../const/contracts/koala-koin-toss.js";
import { createTool } from "../utils/tool-wrapper.js";

export const koalaKoinTossTool = createTool({
  description: "Play a game of Koala Koin Toss game.",
  parameters: z.object({
    gameId: z.number().describe("The game ID to play. 7 is the default game."),
    betAmount: z
      .bigint()
      .describe("The amount to bet. 0.0001 ETH is the default bet amount."),
  }),
  logPrefix: "Koala Koin Toss",

  execute: async ({ gameId, betAmount }) => {
    const agwClient = await createAgwClient();
    const txHash = await agwClient.writeContract({
      address: KOALA_KOIN_TOSS_CONTRACT_ADDRESS,
      functionName: "koin_toss_eth",
      abi: KOALA_KOIN_TOSS_CONTRACT_ABI,
      chain,
      args: [gameId],
      value: betAmount,
    });
    return txHash;
  },
});
