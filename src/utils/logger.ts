import fs from "fs";
import path from "path";

class Logger {
  private static logDir = path.join(__dirname, "../../logs");
  private static logFile = path.join(Logger.logDir, "app.log");

  public static init(): void {
    if (!fs.existsSync(Logger.logDir)) {
      fs.mkdirSync(Logger.logDir);
    }
  }

  public static log(message: string): void {
    const logMessage = `${new Date().toISOString()} - ${message}\n`;
    fs.appendFileSync(Logger.logFile, logMessage);
    console.log(logMessage);
  }

  public static error(message: string): void {
    const errorMessage = `${new Date().toISOString()} - ${message}\n`;
    fs.appendFileSync(Logger.logFile, errorMessage);
    console.log(errorMessage);
  }
}

Logger.init();

export default Logger;
