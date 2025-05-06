import { formatEther } from "viem";
import publicClient from "../lib/viemPublicClient.js";
import type { Address } from "viem";

/**
 * Get the balance of the agents AGW wallet
 * @param address The address of the wallet to get the balance of
 * @returns The balance of the wallet formatted in ether
 */
export default async function getWalletBalance(address: Address) {
  const bal = await publicClient.getBalance({ address });
  return formatEther(bal);
}
