import type {
  Transaction,
  TokenTransferData,
  ContractCallData,
} from "../tools/abstract-user/latest-wallet-transactions.js";
import type { PortfolioValuePoint } from "../tools/abstract-user/portfolio-value-over-time.js";
import type { NFT } from "../tools/abstract-user/wallet-owned-nfts.js";
import type { TokenBalance } from "../tools/abstract-user/wallet-token-balances.js";
import type { Token } from "../tools/abstract-oracle/popular-tokens.js";
import type { PortfolioValueHistory } from "../tools/abstract-user/portfolio-value-over-time.js";

export function formatLatestTransactions(transactions: Transaction[]): string {
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

export function formatPortfolioHistory(history: PortfolioValueHistory): string {
  const hourlyData = history.portfolio["1h"].portfolio;
  const dailyData = history.portfolio["1d"].portfolio;
  const weeklyData = history.portfolio["7d"].portfolio;
  const monthlyData = history.portfolio["30d"].portfolio;
  const yearlyData = history.portfolio["1y"].portfolio;
  const allData = history.portfolio.all.portfolio;

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
${formatData(dailyData, "Daily")}
${formatData(weeklyData, "Weekly")}
${formatData(monthlyData, "Monthly")}
${formatData(yearlyData, "Yearly")}
${formatData(allData, "All Time")}`;
}

export function formatNFTs(nfts: NFT[]): string {
  if (!nfts.length) return "No NFTs found in wallet.";

  return nfts
    .map((nft) => {
      return `${nft.name}${nft.collection ? ` (${nft.collection.name})` : ""}`;
    })
    .join("\n");
}

export function formatTokenBalances(tokens: TokenBalance[]): string {
  if (!tokens.length) return "No token balances found.";

  return tokens
    .filter((token) => !token.isSpam && token.usdValue > 0)
    .sort((a, b) => b.usdValue - a.usdValue)
    .map((token) => {
      const priceChange = token.usdPriceChange?.["1day"] ?? 0;
      const priceChangeEmoji =
        priceChange > 0 ? "📈" : priceChange < 0 ? "📉" : "➡️";

      const verificationStatus =
        token.verificationStatus === "vetted"
          ? "✅"
          : token.verificationStatus === "unknown"
          ? "❓"
          : "⚠️";

      const metadata = token.metadata?.additionalMetadata;
      const links = metadata?.urls
        ? Object.entries(metadata.urls)
            .filter(([_, url]) => url)
            .map(([platform, url]) => `${platform}: ${url}`)
            .join("\n          ")
        : "";

      return `${token.symbol} (${token.name})
        Balance: ${token.balance.decimal} ($${token.usdValue.toFixed(2)})
        Price: $${token.usdPrice.toFixed(6)}
        24h Change: ${priceChangeEmoji} ${priceChange.toFixed(2)}%
        Verification: ${verificationStatus} ${token.verificationStatus}
        Contract: ${token.contract}
        ${metadata?.description ? `Description: ${metadata.description}` : ""}
        ${links ? `Links:\n          ${links}` : ""}
        ------------------------`;
    })
    .join("\n");
}

export function formatPopularTokens(tokens: Token[]): string {
  if (!tokens.length) return "No popular tokens data available.";

  return tokens
    .map((token) => {
      const priceChange = token.usdPriceChange?.["1day"] ?? 0;
      return `${token.symbol}: $${token.usdPrice} [24h: ${priceChange}%]`;
    })
    .join("\n");
}
