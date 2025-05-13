import { z } from "zod";
import { createTool } from "../utils/tool-wrapper.js";
import { chain } from "../const/chain.js";
import createAgwClient from "../lib/createAgwClient.js";
import getWalletAddress from "../lib/get-wallet-address.js";
import publicClient from "../lib/viemPublicClient.js";

/**
 * Write transaction tool uses thirdweb Nebula to execute a transaction on the blockchain.
 * This tool allows executing transactions using natural language prompts.
 */
export const writeTransactionTool = createTool({
  description:
    "Execute a blockchain transaction using natural language prompts.",
  parameters: z.object({
    message: z
      .string()
      .describe(
        "The natural language prompt describing the transaction to execute"
      ),
  }),
  logPrefix: "Write Transaction",

  execute: async ({ message }) => {
    const headers = new Headers({
      "Content-Type": "application/json",
      "x-secret-key": process.env.THIRDWEB_SECRET_KEY || "",
    });

    const response = await fetch("https://nebula-api.thirdweb.com/chat", {
      method: "POST",
      headers,
      body: JSON.stringify({
        message: `Execute the following instructions on ${chain.name}.
        
        The chain is ${chain.name} and the chain id is ${chain.id}.

        ${message}`,
        execute_config: {
          mode: "client",
          chain: {
            id: chain.id,
            rpc: chain.rpcUrls.default.http[0],
          },
          signer_wallet_address: await getWalletAddress(),
        },

        context: {
          chainIds: [chain.id.toString()],
        },
      }),
    });

    const data = await response.json();

    await handleNebulaResponse(data);
  },
});

interface TransactionAction {
  session_id: string;
  request_id: string;
  source: "model";
  type: "sign_transaction";
  tool_name: null;
  description: null;
  kwargs: null;
  data: string; // JSON string containing transaction details
}

interface TransactionData {
  message: string;
  actions: TransactionAction[];
  session_id: string;
  request_id: string;
}

// Type for the parsed transaction data inside the action.data string
interface ParsedTransactionData {
  chainId: number;
  to: `string`;
  value: string;
  data: `0x${string}`;
}

async function handleNebulaResponse(response: TransactionData) {
  if (!response.actions || response.actions.length === 0) {
    return {
      message: response.message,
      error: "No transaction actions were returned from Nebula",
      status: "failed",
    };
  }

  const action = response.actions[0];
  const txData: ParsedTransactionData = JSON.parse(action?.data || "{}");

  const agwClient = await createAgwClient();

  try {
    const txHash = await agwClient.sendTransaction({
      to: txData.to,
      data: txData.data,
      value: BigInt(txData.value),
      chain: chain,
    });

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });

    return {
      message: response.message,
      transactionHash: txHash,
      receipt,
      status: "success",
    };
  } catch (error) {
    console.error("Error executing transaction:", error);
    return {
      message: response.message,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      status: "failed",
    };
  }
}
