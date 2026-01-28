class ApiError extends Error {
    //override constructor for ApiError class
    constructor(
        statusCode,
        message= "Something went wrong",
        errors,
        cause = undefined
    ){
        super(message)
        this.statusCode = statusCode
        this.errors = errors
        this.cause = cause
        this.success = false

        Error.captureStackTrace(this, this.constructor)
    }
}

export {ApiError}
