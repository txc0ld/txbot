import { Address } from "viem";
import "dotenv/config";

export default function loadAgwSignerPrivateKey(): Address {
  let privateKey = process.env.AGW_SIGNER_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error("❌ AGW_SIGNER_PRIVATE_KEY is not set");
  }

  if (!privateKey.startsWith("0x")) {
    privateKey = `0x${privateKey}`;
  }

  if (privateKey.length !== 66) {
    throw new Error("❌ AGW_SIGNER_PRIVATE_KEY is not a valid private key");
  }

  return privateKey as Address;
}
