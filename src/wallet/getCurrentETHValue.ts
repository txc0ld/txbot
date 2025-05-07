import { ABSTRACT_API_ENDPOINT } from "../const/abstract-api.js";

interface ETHValue {
  price: number;
  timestamp: string;
  change24h: number;
}

export async function getCurrentETHValue(): Promise<ETHValue> {
  try {
    const response = await fetch(`${ABSTRACT_API_ENDPOINT}/oracle/eth`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ETHValue = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching current ETH value:", error);
    throw error;
  }
}
