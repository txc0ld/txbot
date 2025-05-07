import { ABSTRACT_API_ENDPOINT } from "../const/abstract-api.js";

interface PortfolioValue {
  totalValue: number;
  tokenTotalValueWithoutSpam: number;
}

export async function getPortfolioValue(address: string): Promise<number> {
  try {
    const response = await fetch(
      `${ABSTRACT_API_ENDPOINT}/user/${address}/portfolio/value/total`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PortfolioValue = await response.json();
    return data.tokenTotalValueWithoutSpam;
  } catch (error) {
    console.error("Error fetching portfolio value:", error);
    throw error;
  }
}
