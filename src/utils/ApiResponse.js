class ApiResponse {
  constructor(statusCode,data = null ,  message = "something is wrong") {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
