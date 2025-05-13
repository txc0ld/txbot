import { privateKeyToAccount } from "viem/accounts";
import { createAbstractClient } from "@abstract-foundation/agw-client";
import { chain } from "../const/chain.js";
import { http } from "viem";
import loadAgwSignerPrivateKey from "./loadAgwSignerPrivateKey.js";

/**
 * Create an AGW client to submit transactions from the portfolio's wallet.
 * This loads the private key from .env and uses it to create an AGW client.
 */
export default async function createAgwClient() {
  const privateKey = loadAgwSignerPrivateKey();
  const account = privateKeyToAccount(privateKey);

  const agwClient = await createAbstractClient({
    chain: chain,
    signer: account,
    transport: http(`${chain.rpcUrls.default.http[0]}`),
  });

  return agwClient;
}
