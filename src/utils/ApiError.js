class ApiError extends Error{
    constructor(
        statusCode,
        message = "something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors


        if(stack) {
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }

    // this.data = null is a common practice 
    // to indicate that the data property is part of t
    // he object structure but currently does not ho
    // ld any value. It improves clarity, consistency, a
    // nd helps avoid issues with uninitialized 
    // properties.
}

export {ApiError}
