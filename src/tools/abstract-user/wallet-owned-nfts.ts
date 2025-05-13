import { z } from "zod";
import getWalletAddress from "../../lib/get-wallet-address.js";
import { ABSTRACT_API_ENDPOINT } from "../../const/abstract-api.js";
import { createTool } from "../../utils/tool-wrapper.js";

export interface NFT {
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

/**
 * Get the NFTs owned by the agent's wallet from the Abstract Portal API.
 * Returns an array of NFTs containing tokenId, contract, name, description, imageUrl, collection, and metadata.
 *
 * This is not used in the current implementation, but could be used in the future.
 */
export const getWalletNFTsTool = createTool({
  description:
    "Get the NFTs owned by the agent's wallet from the Abstract Portal API.",
  parameters: z.object({}),
  logPrefix: "Wallet NFTs",

  execute: async () => {
    return await getWalletNFTs(await getWalletAddress());
  },
});

export async function getWalletNFTs(address: string) {
  const response = await fetch(
    `${ABSTRACT_API_ENDPOINT}/user/${address}/wallet/v2/nfts`
  );
  const data: WalletNFTs = await response.json();
  return data.nfts;
}
