import { createWriteStream } from "fs";
import { join } from "path";

export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

class Logger {
  private logStream: NodeJS.WritableStream;
  private consoleStream: NodeJS.WritableStream;

  constructor() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const logDir = join(process.cwd(), "logs");
    this.logStream = createWriteStream(
      join(logDir, `ai-interaction-${timestamp}.log`)
    );
    this.consoleStream = process.stdout;
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const formattedData = data
      ? `\nData: ${JSON.stringify(data, null, 2)}`
      : "";
    return `[${timestamp}] ${level}: ${message}${formattedData}\n`;
  }

  private log(level: LogLevel, message: string, data?: any) {
    const formattedMessage = this.formatMessage(level, message, data);
    this.logStream.write(formattedMessage);
    this.consoleStream.write(formattedMessage);
  }

  debug(message: string, data?: any) {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: any) {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any) {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, data?: any) {
    this.log(LogLevel.ERROR, message, data);
  }

  logToolCall(toolName: string, args: any) {
    this.info(`Tool Call: ${toolName}`, { arguments: args });
  }

  logToolResult(toolName: string, result: any) {
    this.info(`Tool Result: ${toolName}`, { result });
  }

  logUserInput(input: string) {
    this.info("User Input", { content: input });
  }

  logAIResponse(response: string) {
    this.info("AI Response", { content: response });
  }

  logToolCalls(toolCalls: any) {
    this.info("Tool Calls", { toolCalls });
  }

  logToolResults(toolResults: any) {
    this.info("Tool Results", { toolResults });
  }

  logReasoning(reasoning: any) {
    this.info("Reasoning", { reasoning });
  }

  logFinishReason(finishReason: any) {
    this.info("Finish Reason", { finishReason });
  }

  logSteps(steps: any) {
    this.info("Steps", { steps });
  }

  logExperimentalOutput(experimentalOutput: any) {
    this.info("Experimental Output", { experimentalOutput });
  }

  logResponse(response: any) {
    this.info("Response", { response });
  }
}

export const logger = new Logger();
