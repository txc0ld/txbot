import { getCurrentETHValueTool } from "./abstract-oracle/current-eth-value.js";
import { getPopularTokensTool } from "./abstract-oracle/popular-tokens.js";
import { getTokenMetadataTool } from "./abstract-oracle/token-metadata.js";
import { getLatestWalletTransactionsTool } from "./abstract-user/latest-wallet-transactions.js";
import { getPortfolioValueOverTimeTool } from "./abstract-user/portfolio-value-over-time.js";
import { getPortfolioValueTool } from "./abstract-user/portfolio-value.js";
import { getWalletNFTsTool } from "./abstract-user/wallet-owned-nfts.js";
import { getWalletBalancesTool } from "./abstract-user/wallet-token-balances.js";
import { getWalletAddressTool } from "./abstract-user/wallet-address.js";
import { koalaKoinTossTool } from "./koala-koin-toss.js";
import { readBlockchainTool } from "./read-blockchain.js";

export const oracleTools = {
  "get-current-eth-value": getCurrentETHValueTool,
  "get-popular-tokens": getPopularTokensTool,
  "get-token-metadata": getTokenMetadataTool,
};

export const userTools = {
  "get-wallet-address": getWalletAddressTool,
  "get-latest-wallet-transactions": getLatestWalletTransactionsTool,
  "get-portfolio-value-over-time": getPortfolioValueOverTimeTool,
  "get-portfolio-value": getPortfolioValueTool,
  "get-wallet-nfts": getWalletNFTsTool,
  "get-wallet-balances": getWalletBalancesTool,
};

export const infoTools = {
  "query-blockchain": readBlockchainTool,
};

export const gameTools = {
  "koala-koin-toss": koalaKoinTossTool,
};

export const allTools = {
  ...oracleTools,
  ...userTools,
  ...infoTools,
  ...gameTools,
};
