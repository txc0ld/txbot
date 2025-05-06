import "dotenv/config";
import koalaKoinToss from "./games/koalaKoinToss.js";

async function main() {
  const txHash = await koalaKoinToss();
  console.log(txHash);
}

main().catch(console.error);
