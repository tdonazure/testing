import * as App from "../app";
import { getApiGatewayClient } from "../helpers/client.helper";

beforeAll( () => {
    App.start();
    this.client = getApiGatewayClient();
});

describe("Users API - Users Resource", () => {

    it("Is API returning 200 with valid object", (done) => {

        const method = "GET";
        const pathTemplate = "/metrics-service/metrics/";
        const params = {};
        const queryStringParams = {
            namespace: "metric-poc",
            dataPoints: 1,
            startTime: "2016-12-01T00:00:00Z",
            endTime: "2016-12-10T23:59:00Z",
            dimensionName: "node",
            dimensionValue: "node1"
        };

        this.client.invokeApi(params, pathTemplate, method, { queryParams: queryStringParams }, null)
            .then((response) => {
                console.log("Successfully got response from API gateway");
                return response;
            })
            .then((response) => {
                expect(response.status).toEqual(200);
                expect(response.data).toBeDefined();
                expect(response.data.result).toBeDefined();
                done();
            })
            .catch((response) => {
                console.log(`FAILED to ${method} ${pathTemplate}`,
                    { response });

                done.fail();
            });
    });

});
