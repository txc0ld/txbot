import { z } from "zod";
import { ABSTRACT_API_ENDPOINT } from "../../const/abstract-api.js";
import { createTool } from "../../utils/tool-wrapper.js";
import getWalletAddress from "../../lib/get-wallet-address.js";

interface PortfolioValue {
  totalValue: number;
  tokenTotalValueWithoutSpam: number;
}

/**
 * Get the total portfolio value for a wallet from the Abstract Portal API.
 * Returns the total value and the value of the portfolio excluding spam tokens.
 * This is used to inform the researcher agent about the portfolio's current value.
 */
export const getPortfolioValueTool = createTool({
  description:
    "Get the total portfolio value for a wallet from the Abstract Portal API.",
  parameters: z.object({}),
  logPrefix: "Portfolio Value",

  execute: async () => {
    return await getPortfolioValue(await getWalletAddress());
  },
});

export async function getPortfolioValue(address: string) {
  const response = await fetch(
    `${ABSTRACT_API_ENDPOINT}/user/${address}/portfolio/value/total`
  );

  const data: PortfolioValue = await response.json();
  return data.tokenTotalValueWithoutSpam;
}
