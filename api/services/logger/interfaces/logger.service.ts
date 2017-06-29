export interface LoggerServiceInterface {
    log(message: string, data?: any);
    info(message: string, data?: any);
    debug(message: string, data?: any);
    error(message: string, data?: any);
}

export type LoggerFactory = (className?: string) => LoggerServiceInterface;
