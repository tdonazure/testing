import { inject, injectable } from "inversify";
import "reflect-metadata";
import { LoggerFactory, LoggerServiceInterface } from "../../services/logger/interfaces/logger.service";
import { User } from "./models/user.model";

@injectable()
export class UsersService {

    private logger: LoggerServiceInterface;

    constructor(@inject("LoggerFactory") loggerFactory: LoggerFactory) {
        this.logger = loggerFactory((<any> this).constructor.name);
    }

    public getUsers(): Promise<User[]> {
        return Promise.resolve([]);
    }
}
