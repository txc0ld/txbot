import { ABSTRACT_API_ENDPOINT } from "../const/abstract-api.js";

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

export async function getWalletBalances(
  address: string
): Promise<WalletBalances> {
  try {
    const response = await fetch(
      `${ABSTRACT_API_ENDPOINT}/user/${address}/wallet/balances`
    );

    if (!response.ok) {
      console.error("Error fetching wallet balances:", response);

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: WalletBalances = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching wallet balances:", error);
    throw error;
  }
}
