class ApiResponse {
    constructor(
        statusCode = "Success",
        message = "",
        data = null,
        error = null,
        stack = null
    ){
        this.statusCode = statusCode
        this.message = message
        this.data = data
        this.error = error
        this.stack = stack
        this.success = statusCode < 400
    }
        
    toJSON(){
        return {
            statusCode: this.statusCode,
            message: this.message,
            data: this.data,
            error: this.error,
            stack: this.stack,
            success: this.success
        }
    }
}

export {ApiResponse}
