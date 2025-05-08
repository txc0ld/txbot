import { z } from "zod";
import { ABSTRACT_API_ENDPOINT } from "../../const/abstract-api.js";
import getWalletAddress from "../../lib/get-wallet-address.js";
import { createTool } from "../../utils/tool-wrapper.js";

interface TokenBalance {
  contract: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: {
    decimal: number;
    raw: string;
  };
  usdPrice: number;
  usdValue: number;
  usdPriceChange: {
    "1day": number;
  };
  isSpam: boolean;
  verificationStatus: string;
  contractVerified: boolean;
  metadata?: {
    image?: string;
    additionalMetadata?: {
      description?: string;
      urls?: {
        homepage?: string;
        discord?: string;
        github?: string;
      };
    };
  };
}

interface WalletBalances {
  tokens: TokenBalance[];
  page: string;
}

/**
 * Get the token balances for the agent's wallet from the Abstract Portal API.
 * Returns an array of token balances containing contract, name, symbol, decimals, balance, usdPrice, usdValue, usdPriceChange, isSpam, verificationStatus, contractVerified, and metadata.
 */
export const getWalletBalancesTool = createTool({
  description:
    "Get the token balances for the agent's wallet from the Abstract Portal API.",
  parameters: z.object({}),
  logPrefix: "Wallet Balances",

  execute: async () => {
    const address = await getWalletAddress();
    const response = await fetch(
      `${ABSTRACT_API_ENDPOINT}/user/${address}/wallet/balances`
    );
    const data: WalletBalances = await response.json();
    return data;
  },
});
