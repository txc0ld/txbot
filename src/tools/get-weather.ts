import { tool } from "ai";
import { z } from "zod";

export const getWeatherTool = tool({
  description: "Get the weather in a location (in Celsius)",
  parameters: z.object({
    location: z.string().describe("The location to get the weather for"),
  }),
  execute: async ({ location }) => ({
    location,
    temperature: Math.round((Math.random() * 30 + 5) * 10) / 10, // Random temp between 5°C and 35°C
  }),
});
