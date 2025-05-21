class ApiResponse {
  constructor(statusCode, message = "something is wrong") {
    this.statusCode = statusCode;
    this.message = message;
    this.data = null;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
