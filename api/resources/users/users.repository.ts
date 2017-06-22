import { inject, injectable } from "inversify";
import "reflect-metadata";
import { EnvConfig } from "../../config/env.config";
import { LoggerFactory, LoggerServiceInterface } from "../../services/logger/interfaces/logger.service";
import { DynamoQueryParameters } from "../shared/interfaces/dynamoQueryParameters";
import { Filters } from "../shared/models/filter.model";
import { DynamoRepository } from "../shared/repositories/dynamo.repository";
import { UsersRepositoryInterface } from "./interfaces/users.repository";
import { User } from "./models/user.model";

@injectable()
export class UsersRepository implements UsersRepositoryInterface {

    protected tableName: string;
    protected idProperty: string;
    protected provider: DynamoRepository<User>;

    private logger: LoggerServiceInterface;

    constructor(envConfig: EnvConfig,
                @inject("LoggerFactory") loggerFactory: LoggerFactory) {
        this.provider = new DynamoRepository<User>(envConfig);
        this.idProperty = "userId";
        this.tableName = envConfig.database.usersTable;
        this.logger = loggerFactory((<any> this).constructor.name);
    }

    public createEntity(entity: User): Promise<User> {
        this.logger.info("createEntity called", entity);

        return this.provider.createEntity(this.tableName, entity);
    };

    public readEntity(entityId: string): Promise<User> {
        this.logger.info("readEntity called", entityId);

        return this.provider.readEntity(this.tableName, this.idProperty, entityId);
    };

    public readAllEntities(filters?: Filters, fields?: string[]): Promise<User[]> {
        this.logger.info("readAllEntities called", { filters, fields });

        return this.provider.readAllEntities(this.tableName, this.idProperty, filters, null, fields);
    };

    public readAllByUserName(userName: string, filters?: any, fields?: string[]): Promise<User[]> {
        this.logger.info("readAllByUserName called", { userName, filters, fields });

        const indexName: string = "UserNameIndex"; // matches name of index as defined in the Dynamo DB table
        const expressionAttributeValues: any = { ":userName": userName };
        const keyConditionExpression: string = "userName = :userName";

        const queryExpressionParams = <DynamoQueryParameters> {
            indexName: indexName,
            expressionAttributeValues: expressionAttributeValues,
            keyConditionExpression: keyConditionExpression
        };

        return this.provider.readEntitiesFromQuery(this.tableName, this.idProperty, queryExpressionParams, filters,
            null, fields);
    }

    public updateEntity(entityId: string, updates: User): Promise<User> {
        return this.provider.updateEntity(this.tableName, entityId, updates);
    };

    public deleteEntity(entityId: string): Promise<User> {
        return this.provider.deleteEntity(this.tableName, this.idProperty, entityId);
    };
}
