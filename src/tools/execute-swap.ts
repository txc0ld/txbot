import { z } from "zod";
import { createTool } from "../utils/tool-wrapper.js";
import createAgwClient from "../lib/createAgwClient.js";
import { chain } from "../const/chain.js";
import { parseEther, encodeFunctionData, parseUnits, maxUint256 } from "viem";
import {
  UNISWAP_V2_ROUTER_ADDRESS,
  UNISWAP_V2_ROUTER_ABI,
  ERC20_ABI,
  WETH_ADDRESS,
} from "../const/contracts/uniswap-v2.js";

/**
 * Execute a swap on Uniswap V2.
 * Returns the transaction hash of the swap.
 */
export const executeSwapTool = createTool({
  description: "Execute a swap on Uniswap.",
  parameters: z.object({
    swapType: z.enum(["buy", "sell"]),
    tokenContract: z.string(),
    amount: z.number(),
    ethAmount: z.number(),
  }),
  logPrefix: "Uniswap Swap",
  execute: async ({ swapType, tokenContract, amount, ethAmount }) => {
    console.log(
      `Executing ${swapType} swap for ${amount} of token ${tokenContract}`
    );

    const agwClient = await createAgwClient();
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20);
    const GAS_RESERVE = parseEther("0.00005");
    const value = parseEther(ethAmount.toString()) - GAS_RESERVE;
    const amountInWei = parseEther(amount.toString());

    const slippageTolerance = 0.05; // 5%
    const amountOutMin =
      swapType === "buy"
        ? amountInWei -
          (amountInWei * BigInt(Math.floor(slippageTolerance * 100))) /
            BigInt(100)
        : amountInWei -
          (amountInWei * BigInt(Math.floor(slippageTolerance * 100))) /
            BigInt(100);

    if (swapType === "buy") {
      // Buy: ETH -> Token, no approval needed
      return await agwClient.writeContract({
        address: UNISWAP_V2_ROUTER_ADDRESS,
        abi: UNISWAP_V2_ROUTER_ABI,
        functionName: "swapExactETHForTokens",
        args: [
          amountOutMin,
          [WETH_ADDRESS, tokenContract],
          agwClient.account.address,
          deadline,
        ],
        value,
        chain,
      });
    } else {
      // Sell: Token -> ETH, requires approval first
      const txHash = await agwClient.sendTransactionBatch({
        calls: [
          // 1. Approve tokens for router
          {
            to: tokenContract,
            data: encodeFunctionData({
              abi: ERC20_ABI,
              functionName: "approve",
              args: [UNISWAP_V2_ROUTER_ADDRESS, maxUint256],
            }),
          },
          // 2. Swap tokens for ETH
          {
            to: UNISWAP_V2_ROUTER_ADDRESS,
            data: encodeFunctionData({
              abi: UNISWAP_V2_ROUTER_ABI,
              functionName: "swapExactTokensForETH",
              args: [
                amountInWei,
                BigInt(0), // TODO bad idea
                [tokenContract, WETH_ADDRESS],
                agwClient.account.address,
                deadline,
              ],
            }),
          },
        ],
      });

      return txHash;
    }
  },
});
