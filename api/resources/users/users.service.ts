import { inject, injectable } from "inversify";
import "reflect-metadata";
import { LoggerFactory, LoggerServiceInterface } from "../../services/logger/interfaces/logger.service";
import { User } from "./models/user.model";
import { UsersRepository } from "./users.repository";

@injectable()
export class UsersService {

    private logger: LoggerServiceInterface;

    constructor(
        private userRepository: UsersRepository,
        @inject("LoggerFactory") loggerFactory: LoggerFactory) {
        this.logger = loggerFactory((<any> this).constructor.name);
    }

    public getUsers(): Promise<User[]> {
        return this.userRepository.readAllEntities();
    }
}
