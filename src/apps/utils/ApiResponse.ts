class ApiResponse {
    statusCode: number;
    data: {};
    metaData: {} | null;
    message: string;
    success: boolean;

    constructor(statusCode: number, data: {}, message: string = "Success", metaData: {}){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.metaData = metaData
        this.success = statusCode < 400;
    }
}

export {ApiResponse};