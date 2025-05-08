import { z } from "zod";
import { ABSTRACT_API_ENDPOINT } from "../../const/abstract-api.js";
import getWalletAddress from "../../lib/get-wallet-address.js";
import { createTool } from "../../utils/tool-wrapper.js";

export interface PortfolioValuePoint {
  startTimestamp: number;
  endTimestamp: number;
  totalUsdValue: number;
}

export interface PortfolioValueHistory {
  portfolio: {
    "1h": {
      portfolio: PortfolioValuePoint[];
    };
    "1d": {
      portfolio: PortfolioValuePoint[];
    };
    "7d": {
      portfolio: PortfolioValuePoint[];
    };
    "30d": {
      portfolio: PortfolioValuePoint[];
    };
    "1y": {
      portfolio: PortfolioValuePoint[];
    };
    all: {
      portfolio: PortfolioValuePoint[];
    };
  };
}

/**
 * Get the portfolio value history for the agent's wallet from the Abstract Portal API.
 * Returns an array of portfolio value points containing timestamp and value.
 * Agent can use this to evaluate how their portfolio has performed over time.
 */
export const getPortfolioValueOverTimeTool = createTool({
  description:
    "Get the portfolio value history for the agent's wallet from the Abstract Portal API.",
  parameters: z.object({}),
  logPrefix: "Portfolio Value History",

  execute: async () => {
    return await getPortfolioValueHistory(await getWalletAddress());
  },
});

export async function getPortfolioValueHistory(
  address: string
): Promise<PortfolioValueHistory> {
  const response = await fetch(
    `${ABSTRACT_API_ENDPOINT}/user/${address}/portfolio/value`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch portfolio value history: ${response.statusText}`
    );
  }

  const data: PortfolioValueHistory = await response.json();
  return data;
}
