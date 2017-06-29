import { handleUnexpectedError } from "./response.utils";

describe("Response Utilities", () => {

    const non500errorCode = 400;
    const RESPONSE_CODE_SERVER_ERROR: number = 500;

    describe("handleUnexpectedError()", () => {
        it("should respond with an internal error every time", (done) => {
            const errorResult = {
                response: { status: non500errorCode }
            };
            const resp = handleUnexpectedError(errorResult);

            expect(resp).toBeDefined();
            expect(resp.statusCode).toEqual(RESPONSE_CODE_SERVER_ERROR);
            expect(resp.headers).toBeDefined();
            expect(typeof resp.body).toEqual("string");

            done();
        });

        it("should respond with given error message when one is supplied", (done) => {
            const errorResult = {
                message: "problems!"
            };

            const resp = handleUnexpectedError(errorResult);
            expect(resp).toBeDefined();
            expect(resp.body.indexOf("problems!")).not.toEqual(-1);

            done();
        });

    });
});
