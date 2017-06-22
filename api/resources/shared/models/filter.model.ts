export interface Filters {
    [property: string]: FilterExpression[];
}

export type FilterExpression = ComparisonFilter | FunctionFilter;

export interface ComparisonFilter {
    operator: DynamoFilterOperator;
    value: string | number;
}

export type DynamoFilterOperator = "=" | "<" | "<=" | ">" | ">=";

export interface FunctionFilter {
    conditionFunction: DynamoConditionFunction;
}

export type DynamoConditionFunction = "attribute_not_exists";
