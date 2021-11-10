class ErrorBody {
    constructor(statusCode, message, errors = null) {
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
    }
}

module.exports = ErrorBody