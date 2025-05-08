import { z } from "zod";
import { ABSTRACT_API_ENDPOINT } from "../const/abstract-api.js";
import { createTool } from "../utils/tool-wrapper.js";

interface PortfolioValue {
  totalValue: number;
  tokenTotalValueWithoutSpam: number;
}

export const getPortfolioValueTool = createTool({
  description:
    "Get the total portfolio value for a wallet from the Abstract Portal API.",
  parameters: z.object({
    address: z
      .string()
      .describe("The wallet address to get portfolio value for"),
  }),
  logPrefix: "Portfolio Value",

  execute: async ({ address }) => {
    const response = await fetch(
      `${ABSTRACT_API_ENDPOINT}/user/${address}/portfolio/value/total`
    );

    const data: PortfolioValue = await response.json();
    return data.tokenTotalValueWithoutSpam;
  },
});
