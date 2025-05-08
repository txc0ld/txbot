import getWalletAddress from "../lib/get-wallet-address.js";
import { getCurrentETHValue } from "../tools/abstract-oracle/current-eth-value.js";
import { getPopularTokens } from "../tools/abstract-oracle/popular-tokens.js";
import { getLatestTransactions } from "../tools/abstract-user/latest-wallet-transactions.js";
import { getPortfolioValueHistory } from "../tools/abstract-user/portfolio-value-over-time.js";
import { getPortfolioValue } from "../tools/abstract-user/portfolio-value.js";
import { getWalletNFTs } from "../tools/abstract-user/wallet-owned-nfts.js";
import { getWalletBalances } from "../tools/abstract-user/wallet-token-balances.js";
import {
  formatLatestTransactions,
  formatNFTs,
  formatPopularTokens,
  formatPortfolioHistory,
  formatTokenBalances,
} from "./promptFormatters.js";

export async function createUserPrompt() {
  // 1. Get the wallet address of the AGW.
  const address = await getWalletAddress();

  // 2. Get information about the wallet in parallel.
  const [
    latestTransactions,
    portfolioValue,
    portfolioValueOverTime,
    ownedNfts,
    tokenBalances,
    currentEthValue,
    popularTokens,
  ] = await Promise.all([
    getLatestTransactions(address),
    getPortfolioValue(address),
    getPortfolioValueHistory(address),
    getWalletNFTs(address),
    getWalletBalances(address),
    getCurrentETHValue(),
    getPopularTokens(),
  ]);

  const prompt = `
  Here is the current state of the wallet.

### Latest Transactions
${formatLatestTransactions(latestTransactions)}

### Ethereum Price 
Current ETH Price: $${currentEthValue.current_price}

### Current Portfolio Value
Total Portfolio Value: $${portfolioValue}

### Portfolio Value Over Time
${formatPortfolioHistory(portfolioValueOverTime)}

### Wallet NFTs
${formatNFTs(ownedNfts)}

### Wallet Token Balances
${formatTokenBalances(tokenBalances.tokens)}

### Popular Tokens
${formatPopularTokens(popularTokens)}

Please make a decision on what to do next by making use of the tools available to you.

You MUST make a tool call in your response.
`;

  return prompt;
}
