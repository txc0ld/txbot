import { privateKeyToAccount } from "viem/accounts";
import { createAbstractClient } from "@abstract-foundation/agw-client";
import { chain } from "../const/chain.js";
import { http } from "viem";
import loadAgwSignerPrivateKey from "../util/loadAgwSignerPrivateKey.js";

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

async function main() {
  const agwClient = await createAgwClient();
  console.log(agwClient.account.address);
}

main();
