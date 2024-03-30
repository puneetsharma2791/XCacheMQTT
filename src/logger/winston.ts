import winston from "winston";

export class Logger {
    private static loggerInstance: winston.Logger | null = null

    static getInstance(): winston.Logger {
        if (!Logger.loggerInstance) {
            Logger.loggerInstance = winston.createLogger({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                ),
                transports: [
                    new winston.transports.Console()
                ]
            });
        }
        return Logger.loggerInstance
    }
}