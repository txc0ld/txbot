import { z } from "zod";
import { ABSTRACT_API_ENDPOINT } from "../../const/abstract-api.js";
import { createTool } from "../../utils/tool-wrapper.js";

interface ETHValue {
  current_price: number;
}

/**
 * Get the current USD value of ETH using the Abstract Portal API.
 * Returns the price, timestamp, and 24 hour change in price.
 */
export const getCurrentETHValueTool = createTool({
  description: "Get the current ETH value from the Abstract Portal API.",
  parameters: z.object({}),
  logPrefix: "ETH Value",

  execute: async () => {
    return await getCurrentETHValue();
  },
});

export async function getCurrentETHValue() {
  const response = await fetch(`${ABSTRACT_API_ENDPOINT}/oracle/eth`);
  const data: ETHValue = await response.json();
  return data;
}
