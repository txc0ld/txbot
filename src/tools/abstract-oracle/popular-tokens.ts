import { z } from "zod";
import { ABSTRACT_API_ENDPOINT } from "../../const/abstract-api.js";
import { createTool } from "../../utils/tool-wrapper.js";

export interface Token {
  contract: string;
  metadata: {
    image: string;
    additionalMetadata: {
      description: string;
      urls: {
        reddit: string;
        github: string;
        homepage: string;
      };
      image: {
        thumb: string;
        small: string;
        large: string;
      };
    };
  };
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  volume: {
    "24hour": {
      raw: string;
      usd: number;
    };
    "1day": {
      raw: string;
      usd: number;
    };
    "7day": {
      raw: string;
      usd: number;
    };
    "30day": {
      raw: string;
      usd: number;
    };
    allTime: {
      raw: string;
      usd: number;
    };
  };
  usdPrice: number;
  usdPriceChange: {
    "1day": number;
    "7day": number;
    "30day": number;
  };
  fdv: {
    "1day": string;
  };
  fdvChange: {
    "1day": number;
  };
  isSpam: boolean;
  verificationStatus: "vetted" | "okay" | "unknown";
  contractVerified: boolean;
  notes: string | null;
  updatedAt: string;
  imageUrl: string;
  contractAddress: string;
}

/**
 * Get a list of popular tokens from the Abstract Portal API.
 * Returns an array of tokens containing address, symbol, name, decimals, and chainId.
 */
export const getPopularTokensTool = createTool({
  description: "Get a list of popular tokens from the Abstract Portal API.",
  parameters: z.object({}),
  logPrefix: "Popular Tokens",

  execute: async () => {
    return await getPopularTokens();
  },
});

export async function getPopularTokens() {
  const response = await fetch(
    `${ABSTRACT_API_ENDPOINT}/oracle/list/token?type=popular`
  );
  const data = await response.json();
  return data.tokens.filter(
    (token: Token) =>
      token.contractVerified &&
      !token.isSpam &&
      (token.verificationStatus === "vetted" ||
        token.verificationStatus === "okay")
  );
}
