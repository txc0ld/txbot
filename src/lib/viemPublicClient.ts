import { createPublicClient, http } from "viem";
import { chain } from "../const/chain.js";

/**
 * Viem public client to perform simple read operations on the chain
 */
const publicClient = createPublicClient({
  chain,
  transport: http(),
});

export default publicClient;
