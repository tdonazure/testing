import * as AWS from "aws-sdk";
import { injectable } from "inversify";
import "reflect-metadata";
import { isNullOrUndefined } from "util";
import { EnvConfig } from "../../../config/env.config";
import { DynamoQueryParameters } from "../interfaces/dynamoQueryParameters";
import { ComparisonFilter, FilterExpression, Filters, FunctionFilter } from "../models/filter.model";

@injectable()
export class DynamoRepository<T> {

    protected documentClient: any;

    constructor(envConfig: EnvConfig) {
        this.documentClient = new AWS.DynamoDB.DocumentClient();
    }

    public updateEntity(tableName: string, entityId: string, updates: T): Promise<T> {
        throw new Error("Not implemented");
    }

    public createEntity(tableName: string, entity: T): Promise<T> {
        // TODO: Scan table to verify that no uniqueness constraints are being violated.
        return new Promise<T>((resolve, reject) => {
            const params = {
                TableName: tableName,
                Item: entity
            };

            this.documentClient.put(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(entity);
                }
            });
        });
    }

    public readEntity(tableName: string, idProperty: string, entityId: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const key = {};
            key[idProperty] = entityId;

            const params = {
                TableName: tableName,
                Key: key
            };

            this.documentClient.get(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.Item);
                }
            });
        });
    }

    public readAllEntities(tableName: string,
                           idProperty: string,
                           filters?: Filters,
                           negationFilters?: Filters,
                           fields?: string[]): Promise<T[]> {
        return new Promise<any[]>((resolve, reject) => {
            const params = this.buildParamExpressions(tableName, idProperty, filters, negationFilters, fields);
            let aggregatedData = [];

            this.documentClient.scan(params).eachPage((err, data) => {
                data = data || {};

                if (err) {
                    reject(err);
                } else {
                    aggregatedData = aggregatedData.concat(data.Items || []);

                    if (!data.LastEvaluatedKey) {
                        resolve(aggregatedData);
                    }
                }
            });
        });
    }

    public deleteEntity(tableName: string, idProperty: string, entityId: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const key = {};
            key[idProperty] = entityId;

            const params = {
                TableName: tableName,
                Key: key
            };

            this.documentClient.delete(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public readEntitiesFromQuery(tableName: string,
                                 idProperty: string,
                                 queryParams: DynamoQueryParameters,
                                 filters?: Filters,
                                 negationFilters?: Filters,
                                 fields?: string[]): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            const params = this.buildParamExpressions(tableName, idProperty, filters, negationFilters, fields);

            // add fields specific to querying DynamoDB
            params.IndexName = queryParams.indexName;

            if (isNullOrUndefined(params.ExpressionAttributeValues)) {
                params.ExpressionAttributeValues = {};
            }

            // Combine the ExpressionAttributeValues from the filters with the ExpressionAttributeValues from the query
            // These are required for filter, condition, and query expressions.
            params.ExpressionAttributeValues = Object.assign(params.ExpressionAttributeValues,
                queryParams.expressionAttributeValues);

            params.KeyConditionExpression = queryParams.keyConditionExpression;

            let aggregatedData = [];
            this.documentClient.query(params).eachPage((err, data) => {
                data = data || {};

                if (err) {
                    reject(err);
                } else {
                    aggregatedData = aggregatedData.concat(data.Items || []);

                    if (!data.LastEvaluatedKey) {
                        resolve(aggregatedData);
                    }
                }
            });
        });
    }

    protected generateProjectionExpression(idProperty: string, fields: string[]): any {
        let projectionParams = {
            projectionExpression: "",
            expressionAttributeNames: {}
        };

        // The ID property should always be included in the response, and a validation error will occur if it appears
        // in the projection expression twice
        if (fields.indexOf(idProperty) === -1) {
            fields.push(idProperty);
        }

        let placeholderFields = [];
        for (let field of fields) {
            // so that we don't risk a specified field being in conflict with a DynamoDb keyword
            let fieldName = "#" + field;
            placeholderFields.push(fieldName);

            projectionParams.expressionAttributeNames[fieldName] = field;
        }
        projectionParams.projectionExpression = placeholderFields.join(",");

        return projectionParams;
    }

    protected generateFilterExpression(filters: Filters): any {
        const filterParams = {
            filterExpression: "",
            expressionAttributeNames: {},
            expressionAttributeValues: {}
        };

        let filterKeys: string[] = Object.keys(filters);

        // for each attribute that we want to include in our filter
        for (let filterAttribute of filterKeys) {
            // add ANDs between different attributes being checked
            // so that we can filter through multiple table attributes
            if (filterParams.filterExpression.length > 0) {
                filterParams.filterExpression += " AND ";
            }

            // each attribute will be part of the expressionNames property
            // so that we don't risk conflicting with DynamoDb keywords
            let filterAttributeName = "#" + filterAttribute;
            filterParams.expressionAttributeNames[filterAttributeName] = filterAttribute;

            // go through each value of that attribute and create OR statements
            filterParams.filterExpression += "(";
            let attrValues = filters[filterAttribute];
            let length = attrValues.length;
            for (let i = 0; i < length; i++) {
                let attrValue: FilterExpression = attrValues[i];
                if (this.isComparisonFilter(attrValue)) {
                    let currentAttrValueVar = ":" + filterAttribute + i;
                    let currentExpression = "#" + filterAttribute + " " + attrValue.operator + " "
                        + currentAttrValueVar;

                    filterParams.filterExpression += currentExpression + " ";
                    filterParams.expressionAttributeValues[currentAttrValueVar] = attrValue.value;
                } else if (this.isFunctionFilter(attrValue)) {
                    let currentExpression = attrValue.conditionFunction + " (" + filterAttributeName + ")";

                    filterParams.filterExpression += currentExpression + " ";
                }

                // add ORs between different values of the same attribute being checked
                if (i < length - 1) {
                    filterParams.filterExpression += "OR ";
                }
            }

            filterParams.filterExpression += ")";
        }

        // surround by parentheses for easier concatenation with other condition groups in the expression
        // but if there's only 1 key, then extra parentheses will result in an error
        if (filterKeys.length > 1) {
            filterParams.filterExpression = "(" + filterParams.filterExpression + ") ";
        }

        return filterParams;
    }

    private buildParamExpressions(tableName: string,
                                  idProperty: string,
                                  filters: Filters,
                                  negationFilters: Filters,
                                  fields: any): any {
        let params: any = {
            TableName: tableName,
            ExpressionAttributeNames: {},
            ExpressionAttributeValues: {},
            FilterExpression: ""
        };

        if (!isNullOrUndefined(filters) && Object.keys(filters).length > 0) {
            let filterParams = this.generateFilterExpression(filters);
            params.ExpressionAttributeNames = Object.assign(filterParams.expressionAttributeNames,
                params.ExpressionAttributeNames);
            params.ExpressionAttributeValues = Object.assign(filterParams.expressionAttributeValues,
                params.ExpressionAttributeValues);
            params.FilterExpression += filterParams.filterExpression;
        }

        if (!isNullOrUndefined(negationFilters) && Object.keys(negationFilters).length > 0) {
            let negationFilterParams = this.generateFilterExpression(negationFilters);
            params.ExpressionAttributeNames = Object.assign(negationFilterParams.expressionAttributeNames,
                params.ExpressionAttributeNames);
            params.ExpressionAttributeValues = Object.assign(negationFilterParams.expressionAttributeValues,
                params.ExpressionAttributeValues);

            let finalFilterExpr = "NOT " + negationFilterParams.filterExpression;
            if (params.FilterExpression.length > 0) {
                finalFilterExpr = "AND (" + finalFilterExpr + ") ";
            }
            params.FilterExpression += finalFilterExpr;
        }

        if (!isNullOrUndefined(fields)) {
            let projectionParams = this.generateProjectionExpression(idProperty, fields);
            params.ProjectionExpression = projectionParams.projectionExpression;
            params.ExpressionAttributeNames = Object.assign(projectionParams.expressionAttributeNames,
                params.ExpressionAttributeNames);
        }

        // if any of these are empty, DynamoDb will throw an error
        if (Object.keys(params.ExpressionAttributeNames).length === 0) {
            delete params.ExpressionAttributeNames;
        }

        if (Object.keys(params.ExpressionAttributeValues).length === 0) {
            delete params.ExpressionAttributeValues;
        }

        if (params.FilterExpression.length === 0) {
            delete params.FilterExpression;
        }

        return params;
    }

    private isComparisonFilter(filterExpression: FilterExpression): filterExpression is ComparisonFilter {
        return (<ComparisonFilter> filterExpression).operator !== undefined;
    }

    private isFunctionFilter(filterExpression: FilterExpression): filterExpression is FunctionFilter {
        return (<FunctionFilter> filterExpression).conditionFunction !== undefined;
    }
}
