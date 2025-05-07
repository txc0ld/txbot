import { tool, type Tool } from "ai";
import { z } from "zod";
import { getPortfolioValue } from "../wallet/getPortfolioValue.js";

export const getPortfolioValueTool: Tool = tool({
  description:
    "Get the balance of a wallet (in USD) from the Abstract Portal API.",
  parameters: z.object({
    address: z
      .string()
      .describe("The address of the wallet to get the balance for."),
  }),
  execute: async ({ address }) => {
    const balance = await getPortfolioValue(address);
    return balance;
  },
});
