import HTTP_STATUSES from "./httpStatuses";

class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUSES.NOT_FOUND.code);
  }
}

class ValidationError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUSES.BAD_REQUEST.code);
  }
}

class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUSES.INTERNAL_SERVER_ERROR.code);
  }
}

export { AppError, NotFoundError, ValidationError, DatabaseError };
