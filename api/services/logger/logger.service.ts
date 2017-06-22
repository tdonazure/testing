import { Correlation } from "./correlation.model";
import { LoggerServiceInterface } from "./interfaces/logger.service";

// tslint:disable-next-line:no-var-requires
const CircularJSON = require("circular-json");

export class LoggerService implements LoggerServiceInterface {

    private output: Function;

    constructor(private correlationObject: Correlation, private className?: string) {
        this.output = console.log;
    }

    // The log() function is an alias to allow our Logger class to be used as a logger for AWS sdk calls
    public log   = (message: string, data?: any) => { this.doLog("info" , message, data); };
    public info  = (message: string, data?: any) => { this.doLog("info" , message, data); };
    public debug = (message: string, data?: any) => { this.doLog("debug", message, data); };
    public error = (message: string, data?: any) => { this.doLog("error", message, data); };

    private doLog(level: string, message: string, data: any): void {
        let outObject: any = {
            level: level,
            message: message,
            data: data !== undefined ? data : {},
            timestamp: new Date().toISOString(),
            location: this.className,
            correlationObject: this.correlationObject
        };

        let outString: string;
        try {
            outString = CircularJSON.stringify(outObject);
        } catch (err) {
            outString = `Error trying to serialize for logs ${err}`;
        }

        this.output(outString);
    }
}
