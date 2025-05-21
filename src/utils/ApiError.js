class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went Wrong",
        error = [],
        stack = ""     // these all the things are for the errors occuring at the time of the request and same you can create for the response also...

    ) {

        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.data = null;
        this.message = message;
        this.success = false;
        this.error = error;

        if(stack) this.stack = stack;
        Error.captureStackTrace(this, this.constructor);
        
    }
}

export {ApiError}