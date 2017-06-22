export class DatabaseConfig {
    public usersTable: string;
}

export class EnvConfig {
    public awsRegion: string;
    public apiDomain: string;
    public environmentName: string;

    public database: DatabaseConfig;
}
