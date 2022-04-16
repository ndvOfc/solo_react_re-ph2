class ApiError extends Error {
  constructor(status, message, errors = []) {
    super();
    // eslint-disable-next-line no-unused-expressions
    this.status = status;
    this.message = message;
    this.errors = errors;
  }

  static unAuthorized(message) {
    return new ApiError(401, message);
  }

  static badRequest(message, errors = []) {
    return new ApiError(404, message, errors);
  }

  static internal(message) {
    return new ApiError(500, message);
  }

  static forbidden(message) {
    return new ApiError(403, message);
  }
}

module.exports = ApiError;
