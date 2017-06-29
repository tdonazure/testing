import { ErrorResponse, ResponseModel } from "../resources/shared/models/response.model";

const RESPONSE_CODE_SERVER_ERROR: number = 500;

export function handleUnexpectedError(errorResult: any): ResponseModel {
        let errorData;

        if (typeof errorResult === "string") {
            errorData = errorResult;
        } else {
            errorData = errorResult && errorResult.message;
        }

        // Create the response
        let responseBody: ErrorResponse = {
            errorCode: RESPONSE_CODE_SERVER_ERROR,
            message: "Unexpected Error Occurred",
            data: errorData
        };

        return new ResponseModel(RESPONSE_CODE_SERVER_ERROR, responseBody);
}
