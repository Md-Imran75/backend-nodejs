class ApiError extends Error {
    statusCode: number;
    errors: Array<Record<string, any>>;
    data: any | null;
    success: boolean;
    errorMessage: string;

    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        errors: Array<Record<string, any>> = [],
        data: any = null
    ) { 
        super(message);
        this.errorMessage = message;
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errors = errors;
        this.data = data;
        this.success = false;

    }
}


 export {ApiError};