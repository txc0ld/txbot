import { koalaKoinTossTool } from "./koala-koin-toss.js";
import { readBlockchainTool } from "./read-blockchain.js";
import {
  getWalletBalancesTool,
  getWalletNFTsTool,
  getPortfolioValueOverTimeTool,
  getCurrentETHValueTool,
} from "./wallet-tools.js";

export const allTools = {
  koalaKoinToss: koalaKoinTossTool,
  readBlockchain: readBlockchainTool,
  getWalletBalances: getWalletBalancesTool,
  getWalletNFTs: getWalletNFTsTool,
  getPortfolioValueOverTime: getPortfolioValueOverTimeTool,
  getCurrentETHValue: getCurrentETHValueTool,
};
