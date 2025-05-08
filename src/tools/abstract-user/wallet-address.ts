import { z } from "zod";
import getWalletAddress from "../../lib/get-wallet-address.js";
import { createTool } from "../../utils/tool-wrapper.js";

/**
 * Get the AGW wallet address.
 * Returns the wallet address as a string.
 */
export const getWalletAddressTool = createTool({
  description: "Get the AGW wallet address.",
  parameters: z.object({}),
  logPrefix: "Wallet Address",

  execute: async () => {
    const address = await getWalletAddress();
    return { address };
  },
});
