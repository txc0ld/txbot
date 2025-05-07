import { Nebula } from "thirdweb/ai";
import { chain } from "../../const/chain.js";
import thirdwebClient from "../../lib/thirdwebClient.js";

export default async function askNebula(message: string) {
  const response = await Nebula.chat({
    client: thirdwebClient,
    message,
    contextFilter: {
      // @ts-expect-error - idk why this is not working
      chains: [chain],
    },
  });

  return response;
}
