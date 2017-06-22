import { Container, interfaces } from "inversify";
import { UsersController } from "../resources/users/users.controller";
import { UsersService } from "../resources/users/users.service";
import { Correlation } from "../services/logger/correlation.model";
import { LoggerServiceInterface } from "../services/logger/interfaces/logger.service";
import { LoggerService } from "../services/logger/logger.service";

const container = new Container();

container.bind<UsersController>(UsersController).toSelf();
container.bind<UsersService>(UsersService).toSelf();

// default to bind an empty Correlation object, should rebind correct one in app.start()
let correlationObject: Correlation = <Correlation> {};
container.bind<Correlation>(Correlation).toConstantValue(correlationObject);

container.bind<interfaces.Factory<LoggerServiceInterface>>("LoggerFactory")
    .toFactory<LoggerServiceInterface>(() => {
        return (className?: string) => {
            return new LoggerService(container.get<Correlation>(Correlation), className);
        };
    });

export { container };
