import { createThirdwebClient } from "thirdweb";

/**
 * This code is not used anymore but was part of the original scope for the agent.
 * It was going to use Nebula to execute any generic on-chain action using natural language.
 * Keeping here if we want to revisit adding this functionality.
 *
 * Create a Thirdweb client - used for Nebula
 * Requires a client ID and secret key from Thirdweb in .env
 */
const thirdwebClient = createThirdwebClient({
  clientId: process.env.THIRDWEB_CLIENT_ID!,
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
});

export default thirdwebClient;
