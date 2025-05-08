import { z } from "zod";
import getWalletAddress from "../lib/get-wallet-address.js";
import { ABSTRACT_API_ENDPOINT } from "../const/abstract-api.js";
import { createTool } from "../utils/tool-wrapper.js";

interface NFT {
  tokenId: string;
  contract: string;
  name: string;
  description?: string;
  imageUrl?: string;
  collection?: {
    name: string;
    symbol: string;
  };
  metadata?: {
    attributes?: Array<{
      trait_type: string;
      value: string;
    }>;
  };
}

interface WalletNFTs {
  nfts: NFT[];
  page: string;
}

export const getWalletNFTsTool = createTool({
  description:
    "Get the NFTs owned by the agent's wallet from the Abstract Portal API.",
  parameters: z.object({}),
  logPrefix: "Wallet NFTs",

  execute: async () => {
    const address = await getWalletAddress();
    const response = await fetch(
      `${ABSTRACT_API_ENDPOINT}/user/${address}/wallet/v2/nfts`
    );
    const data: WalletNFTs = await response.json();
    return data.nfts;
  },
});
