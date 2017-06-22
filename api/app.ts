import * as AWS from "aws-sdk";
import { interfaces } from "inversify";
import { DatabaseConfig, EnvConfig } from "./config/env.config";
import { container } from "./config/ioc.config";
import { Correlation } from "./services/logger/correlation.model";
import { LoggerFactory, LoggerServiceInterface } from "./services/logger/interfaces/logger.service";

const envConfig = <EnvConfig> {
    awsRegion: "us-west-2",
    apiDomain: null,
    environmentName: null,

    database: <DatabaseConfig> {
        usersTable: null
    }
};

// Get a LoggerFactory from our IOC container
const loggerFactory = <LoggerFactory> container.get<interfaces.Factory<LoggerServiceInterface>>("LoggerFactory");

export const start = (event) => {
    // Initialize the envConfig with default values
    // API endpoints get the environment config from the API Gateway stageVariables
    const environmentName = event && event.requestContext && event.requestContext.stage;

    // We want to configure the AWS SDK differently in different environments. Here we create a config object so that
    // it can be populated appropriately in the following flow, and then set to AWS in one fell swoop afterwards.
    const awsConfig: any = { };

    if (environmentName === "local" || environmentName === undefined) {

        // Log output that local environment is being used
        loggerFactory("App.start()").info("App.start() called with local environment config", { environmentName });

        // map serverless-webpack's event object to what's actually used by our code
        // and on API Gateway with the integration type LAMBDA_PROXY
        event.requestContext = {
            stage: "local",
            httpMethod: event.method
        };
        event.queryStringParameters = event.queryStringParameters || event.query;
        event.pathParameters = event.pathParameters || event.path;
        event.body = JSON.stringify(event.body); // lambda proxy keeps request body as a string
        process.env.AWS_REGION = "us-west-2";

        // -- config top level
        envConfig.apiDomain = "http://localhost:8170";
        envConfig.environmentName = "local";

        // -- config database
        awsConfig.dynamodb = { endpoint: "http://localhost:8171" };
        envConfig.database.usersTable = "local_DatabaseAzureService_Users";
    }  else {

        // -- config top level
        envConfig.environmentName = event.stageVariables.environmentName;
        envConfig.apiDomain = `https://${event.stageVariables.apiDomain}`;

        // -- config database
        envConfig.database.usersTable = event.stageVariables.usersDynamoTableName;
    }

    // add EnvConfig to container
    container.bind<EnvConfig>(EnvConfig).toConstantValue(envConfig);

    // setup correlationObject
    let correlationObject: Correlation = <Correlation> {};

    try {
        // get the current correlationObject from headers
        if (event.headers && event.headers["correlation-object"]) {
            correlationObject = <Correlation> JSON.parse(event.headers["correlation-object"]);
        }
    } catch (error) {
        // Log the error and continue
        const headers = event && event.headers;
        loggerFactory("App.start()").error("Error occurred while parsing the CorrelationObject", { error, headers });
    }

    // reset context and bind
    correlationObject.context = "database-azure-service-api";
    container.rebind<Correlation>(Correlation).toConstantValue(correlationObject);

    // set aws config
    const logger = loggerFactory("AWS SDK Logger");

    awsConfig.region = process.env.AWS_REGION;
    awsConfig.logger = logger;
    AWS.config.update(awsConfig);
};

export const exit = () => {

    // remove EnvConfig from container
    container.unbind(EnvConfig);
};
