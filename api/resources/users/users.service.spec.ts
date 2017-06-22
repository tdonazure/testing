import { Correlation } from "../../services/logger/correlation.model";
import { LoggerService } from "../../services/logger/logger.service";
import { User } from "./models/user.model";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";

describe("Sites Service", () => {

    beforeEach(() => {
        let correlation = new Correlation();
        let loggerFactory = (className?: string) => { return new LoggerService(correlation, className); };

        let repositoryMock = <UsersRepository> {
            readAllEntities(): Promise<User[]> {
                return new Promise((resolve, reject) => {
                    resolve([
                        <User> {
                            userId: "doe",
                            userName: "John Doe"
                        }
                    ]);
                });
            }
        };
        this.service = new UsersService(repositoryMock, loggerFactory);
    });

    describe("getUsers()", () => {
        it("Should return users", (done) => {
            this.service.getUsers().then((resp) => {
                expect(resp[0].userId).toBe("doe");
                done();
            });
        });
    });
});
