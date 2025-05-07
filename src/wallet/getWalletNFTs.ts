import { ABSTRACT_API_ENDPOINT } from "../const/abstract-api.js";

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

export async function getWalletNFTs(address: string): Promise<WalletNFTs> {
  try {
    const response = await fetch(
      `${ABSTRACT_API_ENDPOINT}/user/${address}/wallet/v2/nfts`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: WalletNFTs = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching wallet NFTs:", error);
    throw error;
  }
}
