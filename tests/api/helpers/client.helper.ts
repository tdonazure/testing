import * as App from "../app";
import { EnvConfig } from "../models/envConfig.model";
// tslint:disable-next-line:no-var-requires
const APIGatewayClientFactory = require("aws-api-gateway-client/apigClient");

export const getApiGatewayClient = () => {

    const config: EnvConfig = App.getEnvConfig();

    const clientConfiguration = {
        invokeUrl: config.apiDomain,
        region: config.awsRegion,
        accessKey: process.env.AWS_ACCESS_KEY_ID,
        secretKey: process.env.AWS_SECRET_ACCESS_KEY
    };

    return APIGatewayClientFactory.newClient(clientConfiguration);
};
