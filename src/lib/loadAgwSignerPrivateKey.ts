import "dotenv/config";

/**
 * Load & format the private key of the AGW signer from .env
 * Checks if the private key is valid and returns it as a 0x prefixed string.
 */
export default function loadAgwSignerPrivateKey(): `0x${string}` {
  let privateKey = process.env.WALLET_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error("❌ WALLET_PRIVATE_KEY is not set");
  }

  if (!privateKey.startsWith("0x")) {
    privateKey = `0x${privateKey}`;
  }

  if (privateKey.length !== 66) {
    throw new Error("❌ WALLET_PRIVATE_KEY is not a valid private key");
  }

  return privateKey as `0x${string}`;
}
