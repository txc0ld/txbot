import { tool, type Tool } from "ai";
import { z } from "zod";
import { logger } from "./logger.js";

type ToolConfig<TInput, TOutput> = {
  description: string;
  parameters: z.ZodType<TInput>;
  execute: (params: TInput) => Promise<TOutput>;
  logPrefix: string;
};

export function createTool<TInput, TOutput>({
  description,
  parameters,
  execute,
  logPrefix,
}: ToolConfig<TInput, TOutput>): Tool {
  return tool({
    description,
    parameters,
    execute: async (params: TInput) => {
      try {
        logger.info(`${logPrefix} - Starting`, params);
        const result = await execute(params);
        logger.info(`${logPrefix} - Completed`, { result });
        return result;
      } catch (error: any) {
        logger.error(`${logPrefix} - Failed`);
        throw error;
      }
    },
  });
}
