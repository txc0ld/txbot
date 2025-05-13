import { createPublicClient, http } from "viem";
import { chain } from "../const/chain.js";

/**
 * Viem public client to perform simple read operations on the chain
 * Mainly used for waiting for tx receipt, especially if the agent decides to do multiple actions.
 */
const publicClient = createPublicClient({
  chain,
  transport: http(),
});

export default publicClient;
