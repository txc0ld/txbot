import { createThirdwebClient } from "thirdweb";

/**
 * Create a Thirdweb client - used for Nebula
 * Requires a client ID and secret key from Thirdweb in .env
 */
const thirdwebClient = createThirdwebClient({
  clientId: process.env.THIRDWEB_CLIENT_ID!,
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
});

export default thirdwebClient;
