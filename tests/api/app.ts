import { EnvConfig } from "./models/envConfig.model";

// tslint:disable-next-line:no-var-requires
const config = require("./config/env.config");

let envConfig = <EnvConfig> {};

const LOCAL = "local";

export const start = () => {

    const environmentName = process.env.NODE_ENV || "not provided: defaulting to local";

    envConfig = config[environmentName] !== undefined ? config[environmentName] : config[LOCAL];
    console.log("Using env config:", JSON.stringify(envConfig, null, 2));

};

export const getEnvConfig = () => {
    return envConfig;
};
