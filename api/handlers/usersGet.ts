import { interfaces } from "inversify";
import * as App from "../app";
import { container } from "../config/ioc.config";
import { UsersController } from "../resources/users/users.controller";
import { LoggerFactory, LoggerServiceInterface } from "../services/logger/interfaces/logger.service";
import { handleUnexpectedError } from "../utils/response.utils";

const loggerFactory = <LoggerFactory> container.get<interfaces.Factory<LoggerServiceInterface>>("LoggerFactory");

export const handler = (event, context, callback) => {
    try {
        App.start(event);

        const usersController = container.get<UsersController>(UsersController);
        usersController.getUsers(event)
            .then((response) => {
                callback(null, response);
            })
            .catch((response) => {
                callback(null, response);
            });
    } catch (e) {
        // Log it
        loggerFactory("usersGet Handler").error("Unexpected Error Occurred", e);
        callback(null, handleUnexpectedError(e));
    }

    App.exit();
};
