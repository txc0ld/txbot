import { tool, type Tool } from "ai";
import { z } from "zod";
import { getWalletBalances } from "../wallet/getWalletBalances.js";
import { getWalletNFTs } from "../wallet/getWalletNFTs.js";
import { getPortfolioValueOverTime } from "../wallet/getPortfolioValueOverTime.js";
import { getCurrentETHValue } from "../wallet/getCurrentETHValue.js";
import getWalletAddress from "../wallet/getWalletAddress.js";

export const getWalletBalancesTool: Tool = tool({
  description:
    "Get the token balances for the agent's wallet from the Abstract Portal API.",
  parameters: z.object({}),
  execute: async () => {
    const address = await getWalletAddress();
    const balances = await getWalletBalances(address);
    return balances;
  },
});

export const getWalletNFTsTool: Tool = tool({
  description:
    "Get the NFTs owned by the agent's wallet from the Abstract Portal API.",
  parameters: z.object({}),
  execute: async () => {
    const address = await getWalletAddress();
    const nfts = await getWalletNFTs(address);
    return nfts;
  },
});

export const getPortfolioValueOverTimeTool: Tool = tool({
  description:
    "Get the portfolio value history for the agent's wallet from the Abstract Portal API.",
  parameters: z.object({}),
  execute: async () => {
    const address = await getWalletAddress();
    const portfolioValue = await getPortfolioValueOverTime(address);
    return portfolioValue;
  },
});

export const getCurrentETHValueTool: Tool = tool({
  description: "Get the current ETH value from the Abstract Portal API.",
  parameters: z.object({}),
  execute: async () => {
    const ethValue = await getCurrentETHValue();
    return ethValue;
  },
});
