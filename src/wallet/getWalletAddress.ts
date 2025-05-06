import createAgwClient from "../lib/createAgwClient.js";

/**
 * Get the address of the agents AGW wallet
 */
export default async function getWalletAddress() {
  const agwClient = await createAgwClient();
  return agwClient.account.address;
}
