import { Correlation } from "../../services/logger/correlation.model";
import { LoggerService } from "../../services/logger/logger.service";
import { UsersService } from "./users.service";

describe("Sites Service", () => {

    beforeEach(() => {
        let correlation = new Correlation();
        let loggerFactory = (className?: string) => { return new LoggerService(correlation, className); };

        this.service = new UsersService(loggerFactory);
    });

    describe("getUsers()", () => {
        it("should return an empty array", (done) => {
            this.service.getUsers().then((resp) => {
                expect(resp.length).toBe(0);
                done();
            });
        });
    });
});
