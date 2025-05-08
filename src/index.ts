import { streamText } from "ai";
import dotenv from "dotenv";
import * as readline from "node:readline/promises";
import { allTools } from "./tools/all-tools.js";
import { systemPrompt } from "./const/system-prompt.js";
import { logger } from "./utils/logger.js";
import { mkdir } from "fs/promises";
import { join } from "path";
import { openai } from "@ai-sdk/openai";
import { CoreMessage } from "ai";
import getWalletAddress from "./lib/get-wallet-address.js";
import { getLatestTransactions } from "./tools/abstract-user/latest-wallet-transactions.js";
import { getPortfolioValue } from "./tools/abstract-user/portfolio-value.js";
import { getPortfolioValueHistory } from "./tools/abstract-user/portfolio-value-over-time.js";
import { getWalletNFTs } from "./tools/abstract-user/wallet-owned-nfts.js";
import { getWalletBalances } from "./tools/abstract-user/wallet-token-balances.js";
import { getCurrentETHValue } from "./tools/abstract-oracle/current-eth-value.js";
import { getPopularTokens } from "./tools/abstract-oracle/popular-tokens.js";
import type {
  Transaction,
  TokenTransferData,
  ContractCallData,
} from "./tools/abstract-user/latest-wallet-transactions.js";
import type { PortfolioValuePoint } from "./tools/abstract-user/portfolio-value-over-time.js";
import type { NFT } from "./tools/abstract-user/wallet-owned-nfts.js";
import type { TokenBalance } from "./tools/abstract-user/wallet-token-balances.js";
import type { Token } from "./tools/abstract-oracle/popular-tokens.js";
import type { PortfolioValueHistory } from "./tools/abstract-user/portfolio-value-over-time.js";

dotenv.config();

// Ensure logs directory exists
await mkdir(join(process.cwd(), "logs"), { recursive: true });

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const messages: CoreMessage[] = [];

async function main() {
  logger.info("Starting AI interaction session");

  while (true) {
    const userInput = await terminal.question("You: ");
    logger.logUserInput(userInput);

    messages.push({ role: "user", content: userInput });

    const result = streamText({
      system: await createSystemPrompt(),
      model: openai("gpt-4o-mini"),
      messages,
      tools: allTools,
      maxSteps: 25,
      onStepFinish: (step) => {},
    });

    let fullResponse = "";
    process.stdout.write("\nAssistant: ");
    for await (const delta of result.textStream) {
      fullResponse += delta;
      process.stdout.write(delta);
    }
    process.stdout.write("\n\n");

    messages.push({ role: "assistant", content: fullResponse });
  }
}

main().catch((error) => {
  logger.error("Fatal error occurred", {
    error: error.message,
    stack: error.stack,
  });
  console.error(error);
});

async function createSystemPrompt() {
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

  console.log(`Latest Transactions`);
  console.log(latestTransactions);

  console.log(`Portfolio Value`);
  console.log(portfolioValue);

  console.log(`Portfolio Value Over Time`);
  console.log(portfolioValueOverTime);

  console.log(`Owned NFTs`);
  console.log(ownedNfts);

  console.log(`Token Balances`);
  console.log(tokenBalances);

  console.log(`Current ETH Value`);
  console.log(currentEthValue);

  console.log(`Popular Tokens`);
  console.log(popularTokens);

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

function formatLatestTransactions(transactions: Transaction[]): string {
  if (!transactions.length) return "No recent transactions found.";

  return transactions
    .map((tx) => {
      const date = new Date(tx.timestamp).toLocaleString();
      const type =
        tx.type === "token_transfer" ? "Token Transfer" : "Contract Call";
      const data = tx.data as TokenTransferData | ContractCallData;

      let details = "";
      if (tx.type === "token_transfer") {
        const transferData = data as TokenTransferData;
        details = `
          Amount: ${transferData.amount.decimal} ${transferData.token.symbol}
          Token: ${transferData.token.name} (${transferData.token.contract})
          Token Decimals: ${transferData.token.decimals}
          Transaction Hash: ${transferData.txHash}`;
      } else {
        const callData = data as ContractCallData;
        details = `
          Function: ${callData.functionSelector}
          Value: ${callData.value} ETH
          Gas Price: ${callData.gasPrice}
          Transaction Hash: ${callData.txHash}`;
      }

      return `[${date}] ${type}
        From: ${tx.fromAddress}
        To: ${tx.toAddress}
        ${details}
        ${
          tx.contractDetails
            ? `Contract: ${tx.contractDetails.name} (${tx.contractDetails.contractAddress})`
            : ""
        }
        ${
          tx.callDetails
            ? `Call: ${tx.callDetails.name} (${tx.callDetails.selector})`
            : ""
        }
        ------------------------`;
    })
    .join("\n");
}

function formatPortfolioHistory(history: PortfolioValueHistory): string {
  const hourlyData = history.portfolio["1h"].portfolio;
  const dailyData = history.portfolio["1d"].portfolio;

  if (!hourlyData.length && !dailyData.length)
    return "No portfolio history available.";

  const formatData = (data: PortfolioValuePoint[], label: string) => {
    if (!data.length) return `No ${label} data available.`;

    return `${label} History:
${data
  .map((point) => {
    const date = new Date(point.startTimestamp * 1000).toLocaleString();
    return `[${date}] $${point.totalUsdValue.toFixed(2)}`;
  })
  .join("\n")}`;
  };

  return `${formatData(hourlyData, "Hourly")}

${formatData(dailyData, "Daily")}`;
}

function formatNFTs(nfts: NFT[]): string {
  if (!nfts.length) return "No NFTs found in wallet.";

  return nfts
    .map((nft) => {
      return `${nft.name}${nft.collection ? ` (${nft.collection.name})` : ""}`;
    })
    .join("\n");
}

function formatTokenBalances(tokens: TokenBalance[]): string {
  if (!tokens.length) return "No token balances found.";

  return tokens
    .filter((token) => !token.isSpam && token.usdValue > 0)
    .sort((a, b) => b.usdValue - a.usdValue)
    .map((token) => {
      const priceChange = token.usdPriceChange?.["1day"] ?? 0;
      return `${token.symbol}: ${token.balance.decimal} ($${token.usdValue}) [24h: ${priceChange}%]`;
    })
    .join("\n");
}

function formatPopularTokens(tokens: Token[]): string {
  if (!tokens.length) return "No popular tokens data available.";

  return tokens
    .map((token) => {
      const priceChange = token.usdPriceChange?.["1day"] ?? 0;
      return `${token.symbol}: $${token.usdPrice} [24h: ${priceChange}%]`;
    })
    .join("\n");
}
