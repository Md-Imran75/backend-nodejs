class ApiError extends Error {
    statusCode: number;
    errors: Array<Record<string, any>>;
    data: any | null;
    success: boolean;

    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        errors: Array<Record<string, any>> = [],
        data: any = null
    ) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errors = errors;
        this.data = data;
        this.success = false;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    toString(): string {
        return `ApiError [${this.statusCode}]: ${this.message}`;
    }
}


 export {ApiError};