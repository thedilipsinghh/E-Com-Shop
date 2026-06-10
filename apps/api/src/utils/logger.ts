type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: any;
}

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private log(level: LogLevel, message: string, meta?: LogContext) {
    const timestamp = new Date().toISOString();
    const formattedMeta = meta ? ` ${JSON.stringify(meta)}` : "";
    console.log(`[${timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}${formattedMeta}`);
  }

  debug(message: string, meta?: LogContext) {
    if (process.env.NODE_ENV === "development") {
      this.log("debug", message, meta);
    }
  }

  info(message: string, meta?: LogContext) {
    this.log("info", message, meta);
  }

  warn(message: string, meta?: LogContext) {
    this.log("warn", message, meta);
  }

  error(message: string, stack?: string) {
    this.log("error", message, stack ? { stack } : undefined);
  }
}