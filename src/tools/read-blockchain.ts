import { z } from "zod";
import { Nebula } from "thirdweb/ai";
import thirdwebClient from "../lib/thirdwebClient.js";
import { createTool } from "../utils/tool-wrapper.js";
import { chain } from "../const/chain.js";

/**
 * Use thirdweb Nebula to ask a naturla language query about the blockchain.
 * Returns a text response from the LLM after querying the blockchain.
 */
export const readBlockchainTool = createTool({
  description: `Query some information from the blockchain using natural language.

  Examples (Understand)
• "What ERC standards are implemented by contract address 0x59325733eb952a92e069C87F0A6168b29E80627f on Ethereum?"
• "What functions can I use to mint more of my contract's NFTs?"
• "What is the total supply of NFTs on 0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e?"

Examples (Interact)
• "How much ETH is in my wallet?"
• "What is the wallet address of vitalik.eth?"
• "Does my wallet hold USDC on Base?"

Examples (Explore)
• "What is the last block on Abstract?"
• "What is the current gas price on Abstract?"
• "Can you show me transaction details for 0xdfc450bb39e44bd37c22e0bfd0e5212edbea571e4e534d87b5cbbf06f10b9e04 on Abstract?"

Examples (Research)
• "What is the address of USDC on Abstract?"
• "Is there a CHENGU token on Abstract?"
• "What is the current price of PENGU?"`,
  parameters: z.object({
    message: z.string().describe("The message to ask the blockchain."),
  }),
  logPrefix: "Blockchain Query",

  execute: async ({ message }) => {
    const response = await Nebula.chat({
      client: thirdwebClient,
      message,
      contextFilter: {
        chains: [
          {
            id: chain.id,
            rpc: chain.rpcUrls.default.http[0],
          },
        ],
      },
    });
    return response;
  },
});
