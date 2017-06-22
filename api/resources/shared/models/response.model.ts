export class ResponseModel {
    public body: string;
    public headers: any;

    constructor(public statusCode: number, bodyObject: any) {
        this.body = JSON.stringify(bodyObject);
        this.headers = {
            "Access-Control-Allow-Origin": "*"
        };
    }
}

export interface SuccessResponse<T> {
    result: T;
}

export interface ErrorResponse {
    errorCode: number;
    message: string;
    data: any;
}
