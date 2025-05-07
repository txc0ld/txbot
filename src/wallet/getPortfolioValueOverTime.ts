import { ABSTRACT_API_ENDPOINT } from "../const/abstract-api.js";

interface PortfolioValuePoint {
  timestamp: string;
  value: number;
}

interface PortfolioValueHistory {
  values: PortfolioValuePoint[];
}

export async function getPortfolioValueOverTime(
  address: string
): Promise<PortfolioValueHistory> {
  try {
    const response = await fetch(
      `${ABSTRACT_API_ENDPOINT}/user/${address}/portfolio/value`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PortfolioValueHistory = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching portfolio value history:", error);
    throw error;
  }
}
