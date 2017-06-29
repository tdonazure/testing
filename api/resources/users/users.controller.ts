import { inject, injectable } from "inversify";
import "reflect-metadata";
import { LoggerFactory, LoggerServiceInterface } from "../../services/logger/interfaces/logger.service";
import { handleUnexpectedError } from "../../utils/response.utils";
import { ResponseModel, SuccessResponse } from "../shared/models/response.model";
import { User } from "./models/user.model";
import { UsersService } from "./users.service";

@injectable()
export class UsersController {

    private logger: LoggerServiceInterface;

    private RESPONSE_CODE_OK: number = 200;

    constructor(
        private usersService: UsersService,
        @inject("LoggerFactory") loggerFactory: LoggerFactory
    ) {
        this.logger = loggerFactory((<any> this).constructor.name);
    }

    public getUsers(event: any): Promise<ResponseModel> {
        this.logger.info("getUsers called", event);

        return this.usersService.getUsers()
            .then((users: User[]) => {
                let responseBody: SuccessResponse<User[]> = {
                    result: users
                };
                return new ResponseModel(this.RESPONSE_CODE_OK, responseBody);
            })
            .catch((reason: any) => {
                this.logger.error("An unexpected error occurred!", { event, reason });
                return handleUnexpectedError(reason);
            });
    }
}
