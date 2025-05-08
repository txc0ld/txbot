import { z } from "zod";
import { chain } from "../const/chain.js";
import createAgwClient from "../lib/createAgwClient.js";
import {
  KOALA_KOIN_TOSS_CONTRACT_ADDRESS,
  KOALA_KOIN_TOSS_CONTRACT_ABI,
} from "../const/contracts/koala-koin-toss.js";
import { createTool } from "../utils/tool-wrapper.js";
import { parseEther } from "viem";

/**
 * Play a game of Koala Koin Toss.
 * Returns the transaction hash of the bet.
 */
export const koalaKoinTossTool = createTool({
  description: "Play a game of Koala Koin Toss game.",
  parameters: z.object({
    gameId: z.number().describe("The game ID to play. 7 is the default game."),
    betAmount: z
      .number()
      .describe(
        "The amount of ETH to bet in number format. Either 0.002, 0.004, 0.008, or 0.016."
      ),
  }),
  logPrefix: "Koala Koin Toss",

  execute: async ({ gameId, betAmount }) => {
    console.log("Playing Koala Koin Toss game...");
    const agwClient = await createAgwClient();
    const txHash = await agwClient.writeContract({
      address: KOALA_KOIN_TOSS_CONTRACT_ADDRESS,
      functionName: "koin_toss_eth",
      abi: KOALA_KOIN_TOSS_CONTRACT_ABI,
      chain,
      args: [gameId],
      value: parseEther(betAmount.toString()),
    });
    return txHash;
  },
});
