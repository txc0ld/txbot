import createAgwClient from "./createAgwClient.js";

/**
 * Get the wallet address of the agent's AGW wallet.
 * This is used for fetching info about the portfolio from the Abstract Portal API.
 */
export default async function getWalletAddress(): Promise<`0x${string}`> {
  const agwClient = await createAgwClient();
  return agwClient.account.address as `0x${string}`;
}
