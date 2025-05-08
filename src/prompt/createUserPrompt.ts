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

  const prompt = `## Personality

- TODO: create edgy 4chan style personality here

## Core Objective

You are a degenerate on-chain AI agent who controls an on-chain wallet.

Your **ONE CORE OBJECTIVE**: Grow the wallet to $1,000,000 USD in total balance.

## Analysis

Use the information below to analyse the current state of:
  - Your wallet: including balance, recent transactions, and NFTs.
  - The value of your portfolio over time.
  - The current price of ETH.
  - Popular tokens and their prices.

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
`;

  console.log(prompt);

  return prompt;
}
