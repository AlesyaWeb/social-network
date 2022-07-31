module.exports = class ApiError extends Error {
    status;
    errors;
    resultCode;
    constructor(status, message, errors, resultCode) {
        super(message);
        this.status = status;
        this.errors = errors;
        this.resultcode = resultCode;
    }
    static UnauthorizedError() {
        return new ApiError(401, 'User did not authorized', [], 1)
    }
    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors, 1)
    }
    static IncorrectCaptcha() {
        return new ApiError(409, 'Incorrect captcha', [], 0)
    }
}