import { z } from "zod";
import { formatEther } from "viem";
import publicClient from "../lib/viemPublicClient.js";
import type { Address } from "viem";
import { createTool } from "../utils/tool-wrapper.js";

export const getWalletBalanceTool = createTool({
  description: "Get the native token balance of a wallet.",
  parameters: z.object({
    address: z.string().describe("The wallet address to get the balance for"),
  }),
  logPrefix: "Wallet Balance",

  execute: async ({ address }) => {
    const bal = await publicClient.getBalance({
      address: address as Address,
    });
    const formattedBalance = formatEther(bal);
    return formattedBalance;
  },
});
