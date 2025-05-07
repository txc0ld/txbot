/**
 * Read blockchain tool uses thirdweb Nebuula to ask a naturla language query
 * regarding some information on the blockchain.
 */

import { tool, type Tool } from "ai";
import { z } from "zod";
import askNebula from "../onchain/read/ask-nebula.js";

export const readBlockchainTool: Tool = tool({
  description: `Query some information from the blockchain using natural language.
    
Examples (Bridge & Swap)
• "Swap 1 USDC to 1 USDT on the Ethereum Mainnet"
• "Bridge 0.5 ETH from Ethereum Mainnet to Polygon"

Examples (Transfer)
• "Send 0.1 ETH to vitalik.eth"
• "Transfer 1 USDC to jarrodwatts.eth on Abstract"

Examples (Deploy)
• "Deploy a Token ERC20 Contract with name "Hello World" and description "My Hello Contract" on Ethereum."
• "Deploy a Split contract with two recipients."
• "Deploy an ERC1155 Contract named 'Hello World' with description 'Hello badges on Ethereum'"

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
• "What is the address of USDC on Ethereum?"
• "Is there a CHENGU token on Abstract?"
• "What is the current price of PENGU?"`,

  parameters: z.object({
    message: z.string().describe("The message to ask the blockchain."),
  }),

  execute: async ({ message }) => {
    const response = await askNebula(message);
    return response;
  },
});
