import { z } from "zod";
import { ABSTRACT_API_ENDPOINT } from "../../const/abstract-api.js";
import { createTool } from "../../utils/tool-wrapper.js";
import getWalletAddress from "../../lib/get-wallet-address.js";

export interface Token {
  contract: string;
  metadata: {
    image?: string;
  };
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}

export interface Amount {
  raw: string;
  decimal: number;
  usd?: number;
}

export interface TokenTransferData {
  token: Token;
  amount: Amount;
  txHash: string;
}

export interface ContractCallData {
  tokenToAddress?: string;
  gasPrice: string;
  value: string;
  txHash: string;
  functionSelector: string;
  token?: Token;
  amount?: Amount;
}

export interface TokenSwapData {
  token: Token;
  amount: Amount;
  chainId: string;
  txHash: string;
}

export interface SwapData {
  fromToken: TokenSwapData;
  toToken: TokenSwapData;
}

export interface ContractDetails {
  contractAddress: string;
  name: string;
  app?: {
    id: string;
    name: string;
    description: string;
    icon: string;
    banner: string;
    link: string;
    spotlight: string;
    launched: boolean;
  };
}

export interface CallDetails {
  contractAddress: string;
  name: string;
  selector: string;
}

export interface Transaction {
  type: "token_transfer" | "contract_call" | "swap";
  fromAddress: string;
  toAddress: string;
  timestamp: string;
  data: TokenTransferData | ContractCallData | SwapData;
  isSpam: boolean;
  contractDetails?: ContractDetails;
  callDetails?: CallDetails;
  isHidden: boolean;
}

interface TransactionsResponse {
  transactions: Transaction[];
  page: string;
}

/**
 * Get the latest transactions for a wallet from the Abstract Portal API.
 * Returns an array of transactions.
 */
export const getLatestWalletTransactionsTool = createTool({
  description:
    "Get the latest transactions for a wallet from the Abstract Portal API.",
  parameters: z.object({}),
  logPrefix: "Wallet Transactions",

  execute: async () => {
    return await getLatestTransactions(await getWalletAddress());
  },
});

export async function getLatestTransactions(address: string) {
  const response = await fetch(
    `${ABSTRACT_API_ENDPOINT}/user/${address}/transactions`
  );
  const data: TransactionsResponse = await response.json();
  return data.transactions;
}
