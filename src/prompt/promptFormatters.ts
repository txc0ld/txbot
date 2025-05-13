import type {
  Transaction,
  TokenTransferData,
  ContractCallData,
  SwapData,
} from "../tools/abstract-user/latest-wallet-transactions.js";
import type { PortfolioValuePoint } from "../tools/abstract-user/portfolio-value-over-time.js";
import type { NFT } from "../tools/abstract-user/wallet-owned-nfts.js";
import type { TokenBalance } from "../tools/abstract-user/wallet-token-balances.js";
import type { Token } from "../tools/abstract-oracle/popular-tokens.js";
import type { PortfolioValueHistory } from "../tools/abstract-user/portfolio-value-over-time.js";

export function formatLatestTransactions(transactions: Transaction[]): string {
  if (!transactions.length)
    return "<no_transactions>No recent transactions found.</no_transactions>";

  return transactions
    .map((tx) => {
      const date = new Date(tx.timestamp).toLocaleString();
      let type = "";
      let details = "";

      if (tx.type === "token_transfer") {
        type = "Token Transfer";
        const transferData = tx.data as TokenTransferData;
        details = `
          <amount>${transferData.amount.decimal} ${transferData.token.symbol}</amount>
          <token>${transferData.token.name} (${transferData.token.contract})</token>
          <decimals>${transferData.token.decimals}</decimals>
          <tx_hash>${transferData.txHash}</tx_hash>`;
      } else if (tx.type === "swap") {
        type = "Swap";
        const swapData = tx.data as SwapData;
        details = `
          <from_token>
            <symbol>${swapData.fromToken.token.symbol}</symbol>
            <name>${swapData.fromToken.token.name}</name>
            <contract>${swapData.fromToken.token.contract}</contract>
            <amount>${swapData.fromToken.amount.decimal}</amount>
            <usd_value>${swapData.fromToken.amount.usd || "0"}</usd_value>
          </from_token>
          <to_token>
            <symbol>${swapData.toToken.token.symbol}</symbol>
            <name>${swapData.toToken.token.name}</name>
            <contract>${swapData.toToken.token.contract}</contract>
            <amount>${swapData.toToken.amount.decimal}</amount>
            <usd_value>${swapData.toToken.amount.usd || "0"}</usd_value>
          </to_token>
          <tx_hash>${swapData.fromToken.txHash}</tx_hash>`;
      } else {
        type = "Contract Call";
        const callData = tx.data as ContractCallData;
        details = `
          <function>${callData.functionSelector || "Unknown"}</function>
          <value>${callData.value || "0"} ETH</value>
          <gas_price>${callData.gasPrice || "Unknown"}</gas_price>
          <tx_hash>${callData.txHash}</tx_hash>`;
      }

      return `<transaction type="${type}" timestamp="${date}">
        <from_address>${tx.fromAddress}</from_address>
        <to_address>${tx.toAddress}</to_address>
        ${details}
        ${
          tx.contractDetails
            ? `<contract>${tx.contractDetails.name} (${tx.contractDetails.contractAddress})</contract>`
            : ""
        }
        ${
          tx.callDetails
            ? `<call>${tx.callDetails.name} (${tx.callDetails.selector})</call>`
            : ""
        }
</transaction>`;
    })
    .join("\n");
}

export function formatPortfolioHistory(history: PortfolioValueHistory): string {
  const hourlyData = history.portfolio["1h"].portfolio;
  const dailyData = history.portfolio["1d"].portfolio;
  const weeklyData = history.portfolio["7d"].portfolio;
  const monthlyData = history.portfolio["30d"].portfolio;
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
${formatData(monthlyData, "Monthly")}`;
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
  if (!tokens.length) return "<no_tokens>No token balances found.</no_tokens>";

  return tokens
    .filter((token) => !token.isSpam && token.usdValue > 0)
    .sort((a, b) => b.usdValue - a.usdValue)
    .map((token) => {
      // Convert price change from decimal to percentage
      // API returns 1.01 for 1% increase, 0.95 for 5% decrease
      const priceChangeRaw = token.usdPriceChange?.["1day"] || 0;
      const priceChangePercent =
        priceChangeRaw > 1
          ? (priceChangeRaw - 1) * 100 // For increases: convert 1.05 to 5%
          : priceChangeRaw < 1
          ? (priceChangeRaw - 1) * 100 // For decreases: convert 0.95 to -5%
          : 0;

      return `<token>
  <symbol>${token.symbol}</symbol>
  <name>${token.name}</name>
  <contract>${token.contract}</contract>
  <verification_status>${token.verificationStatus}</verification_status>
  <balance>${token.balance.decimal}</balance>
  <usd_value>${token.usdValue.toFixed(2)}</usd_value>
  <price>${token.usdPrice.toFixed(6)}</price>
  <price_change percent="${priceChangePercent.toFixed(2)}">${
        priceChangePercent > 0
          ? "increase"
          : priceChangePercent < 0
          ? "decrease"
          : "unchanged"
      }</price_change>
</token>`;
    })
    .join("\n");
}

export function formatPopularTokens(tokens: Token[]): string {
  if (!tokens.length)
    return "<no_tokens>No popular tokens data available.</no_tokens>";

  function formatNumber(num: number): string {
    if (num >= 1_000_000_000) {
      return `$${(num / 1_000_000_000).toFixed(2)}B`;
    } else if (num >= 1_000_000) {
      return `$${(num / 1_000_000).toFixed(2)}M`;
    } else if (num >= 1_000) {
      return `$${(num / 1_000).toFixed(2)}K`;
    } else {
      return `$${num.toFixed(2)}`;
    }
  }

  return tokens
    .map((token) => {
      // Price changes (converting from decimal to percentage)
      // API returns 1.53 for 53% increase, 0.95 for 5% decrease
      const priceChange1dRaw = token.usdPriceChange?.["1day"] || 0;
      const priceChange7dRaw = token.usdPriceChange?.["7day"] || 0;
      const priceChange30dRaw = token.usdPriceChange?.["30day"] || 0;

      const priceChange1d =
        priceChange1dRaw > 1
          ? (priceChange1dRaw - 1) * 100
          : priceChange1dRaw < 1
          ? (priceChange1dRaw - 1) * 100
          : 0;

      const priceChange7d =
        priceChange7dRaw > 1
          ? (priceChange7dRaw - 1) * 100
          : priceChange7dRaw < 1
          ? (priceChange7dRaw - 1) * 100
          : 0;

      const priceChange30d =
        priceChange30dRaw > 1
          ? (priceChange30dRaw - 1) * 100
          : priceChange30dRaw < 1
          ? (priceChange30dRaw - 1) * 100
          : 0;

      // Volume formatting
      const volume1d = formatNumber(token.volume?.["1day"]?.usd ?? 0);
      const volume7d = formatNumber(token.volume?.["7day"]?.usd ?? 0);
      const volume30d = formatNumber(token.volume?.["30day"]?.usd ?? 0);

      return `<token>
  <symbol>${token.symbol}</symbol>
  <name>${token.name}</name>
  <contract>${token.contractAddress}</contract>
  <verification_status>${token.verificationStatus}</verification_status>
  <price>${token.usdPrice.toFixed(6)}</price>
  <price_changes>
    <day_change percent="${priceChange1d.toFixed(2)}">${
        priceChange1d > 0
          ? "increase"
          : priceChange1d < 0
          ? "decrease"
          : "unchanged"
      }</day_change>
    <week_change percent="${priceChange7d.toFixed(2)}">${
        priceChange7d > 0
          ? "increase"
          : priceChange7d < 0
          ? "decrease"
          : "unchanged"
      }</week_change>
    <month_change percent="${priceChange30d.toFixed(2)}">${
        priceChange30d > 0
          ? "increase"
          : priceChange30d < 0
          ? "decrease"
          : "unchanged"
      }</month_change>
  </price_changes>
  <volumes>
    <day_volume>${volume1d}</day_volume>
    <week_volume>${volume7d}</week_volume>
    <month_volume>${volume30d}</month_volume>
  </volumes>
</token>`;
    })
    .join("\n");
}
