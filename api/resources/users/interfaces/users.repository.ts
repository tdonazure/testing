import { Filters } from "../../shared/models/filter.model";
import { User } from "../models/user.model";

export interface UsersRepositoryInterface {
    createEntity(entity: User): Promise<User>;

    readEntity(entityId: string): Promise<User>;

    readAllEntities(filters?: Filters, fields?: string[]): Promise<User[]>;

    readAllByUserName(userName: string, filters?: Filters, fields?: string[]): Promise<User[]>;

    updateEntity(entityId: string, updates: User): Promise<User>;

    deleteEntity(entityId: string): Promise<User>;
}
