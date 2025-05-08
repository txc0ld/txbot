import { privateKeyToAccount } from "viem/accounts";
import { createAbstractClient } from "@abstract-foundation/agw-client";
import { chain } from "../const/chain.js";
import { http } from "viem";
import loadAgwSignerPrivateKey from "./loadAgwSignerPrivateKey.js";

/**
 * Create an AGW client given a private key to submit transactions with.
 * This loads the .env to get the private key then sends transactions from the AGW.
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
