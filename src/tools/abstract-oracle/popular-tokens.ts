import { z } from "zod";
import { ABSTRACT_API_ENDPOINT } from "../../const/abstract-api.js";
import { createTool } from "../../utils/tool-wrapper.js";

interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
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
    const response = await fetch(
      `${ABSTRACT_API_ENDPOINT}/oracle/list/token?type=popular`
    );
    const data: Token[] = await response.json();
    return data;
  },
});
