import { z } from "zod";
import { ABSTRACT_API_ENDPOINT } from "../../const/abstract-api.js";
import { createTool } from "../../utils/tool-wrapper.js";

interface Token {
  contract: string;
  metadata: {
    image?: string;
  };
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}

interface Amount {
  raw: string;
  decimal: number;
  usd?: number;
}

interface TokenTransferData {
  token: Token;
  amount: Amount;
  txHash: string;
}

interface ContractCallData {
  tokenToAddress?: string;
  gasPrice: string;
  value: string;
  txHash: string;
  functionSelector: string;
  token?: Token;
  amount?: Amount;
}

interface ContractDetails {
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

interface CallDetails {
  contractAddress: string;
  name: string;
  selector: string;
}

interface Transaction {
  type: "token_transfer" | "contract_call";
  fromAddress: string;
  toAddress: string;
  timestamp: string;
  data: TokenTransferData | ContractCallData;
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
  parameters: z.object({
    address: z.string().describe("The wallet address to get transactions for"),
  }),
  logPrefix: "Wallet Transactions",

  execute: async ({ address }) => {
    const response = await fetch(
      `${ABSTRACT_API_ENDPOINT}/user/${address}/transactions`
    );
    const data: TransactionsResponse = await response.json();
    return data.transactions;
  },
});
