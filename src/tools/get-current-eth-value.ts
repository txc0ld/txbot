import { z } from "zod";
import { ABSTRACT_API_ENDPOINT } from "../const/abstract-api.js";
import { createTool } from "../utils/tool-wrapper.js";

interface ETHValue {
  price: number;
  timestamp: string;
  change24h: number;
}

export const getCurrentETHValueTool = createTool({
  description: "Get the current ETH value from the Abstract Portal API.",
  parameters: z.object({}),
  logPrefix: "ETH Value",

  execute: async () => {
    const response = await fetch(`${ABSTRACT_API_ENDPOINT}/oracle/eth`);
    const data = await response.json();
    return data;
  },
});
