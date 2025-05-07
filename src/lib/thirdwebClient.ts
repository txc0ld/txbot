import { createThirdwebClient } from "thirdweb";

/**
 * Create a Thirdweb client
 */
const client = createThirdwebClient({
  clientId: process.env.THIRDWEB_CLIENT_ID!,
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
});

export default client;
