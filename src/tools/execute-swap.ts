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
import publicClient from "../lib/viemPublicClient.js";

/**
 * Execute a swap on Uniswap V2.
 * Returns the transaction hash of the swap.
 * This tool is used by agent #2, the "trader" or "executor agent".
 * It takes the trade decision from the researcher agent and executes the swap on-chain.
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

    // Create AGW client to submit the tx to execute the swap on-chain.
    const agwClient = await createAgwClient();

    // Set a deadline for the swap to be executed (20 minutes from now)
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20);

    // Try save some gas in the account by not spending the full balance.
    const GAS_RESERVE = parseEther("0.00005");

    // Parse the amount of ETH to spend on the swap (value field)
    // Calculate the amount of ETH to spend on the swap (value field)
    const parsedAmount = parseEther(ethAmount.toString());
    const value =
      parsedAmount <= GAS_RESERVE ? BigInt(0) : parsedAmount - GAS_RESERVE;

    // Parse the amount of tokens to swap (amount field)
    const amountInWei = parseEther(amount.toString());

    // Calculate the amount of tokens to receive (amountOutMin)
    const slippageTolerance = 0.05; // 5%
    const amountOutMin =
      swapType === "buy"
        ? amountInWei -
          (amountInWei * BigInt(Math.floor(slippageTolerance * 100))) /
            BigInt(100)
        : amountInWei -
          (amountInWei * BigInt(Math.floor(slippageTolerance * 100))) /
            BigInt(100);

    // Execute the swap to buy or sell the token.
    if (swapType === "buy") {
      // Buy: ETH -> Token, no approval needed
      const txHash = await agwClient.writeContract({
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

      // Wait for the tx to be mined in case agent decides to do multiple trades in same run.
      await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      return txHash;
    } else {
      // Sell: Token -> ETH, requires approval first. AGW supports batching which we use here.
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
                BigInt(0), // TODO very bad idea, but works for now.
                [tokenContract, WETH_ADDRESS],
                agwClient.account.address,
                deadline,
              ],
            }),
          },
        ],
      });

      // Wait for the tx to be mined in case agent decides to do multiple trades in same run.
      await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      return txHash;
    }
  },
});
