import { tool, type Tool } from "ai";
import { z } from "zod";
import { getLatestWalletTransactions } from "../wallet/getLatestWalletTransactions.js";

export const getLatestWalletTransactionsTool: Tool = tool({
  description:
    "Get the latest transactions for a wallet from the Abstract Portal API.",
  parameters: z.object({
    address: z
      .string()
      .describe(
        "The address of the wallet to get the latest transactions for."
      ),
  }),
  execute: async ({ address }) => {
    const transactions = await getLatestWalletTransactions(address);
    return transactions;
  },
});
