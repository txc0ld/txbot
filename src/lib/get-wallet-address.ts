import createAgwClient from "./createAgwClient.js";

/**
 * Get the address of the agents AGW wallet
 */
export default async function getWalletAddress(): Promise<`0x${string}`> {
  const agwClient = await createAgwClient();
  return agwClient.account.address as `0x${string}`;
}
