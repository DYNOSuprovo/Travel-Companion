export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode = 500,
    public details?: Record<string, any>,
  ) {
    super(message)
    this.name = "AppError"
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    }
  }
}

// Common error codes
export const ErrorCodes = {
  // Authentication
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  INVALID_TOKEN: "INVALID_TOKEN",

  // Validation
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_INPUT: "INVALID_INPUT",
  MISSING_FIELD: "MISSING_FIELD",

  // Database
  DB_ERROR: "DB_ERROR",
  NOT_FOUND: "NOT_FOUND",
  DUPLICATE_RECORD: "DUPLICATE_RECORD",

  // Server
  INTERNAL_ERROR: "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  RATE_LIMITED: "RATE_LIMITED",

  // Business logic
  OPERATION_FAILED: "OPERATION_FAILED",
  INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",
}

export function createErrorResponse(statusCode: number, code: string, message: string, details?: Record<string, any>) {
  return {
    status: statusCode,
    body: {
      error: {
        code,
        message,
        details,
        timestamp: new Date().toISOString(),
      },
    },
  }
}

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return createErrorResponse(error.statusCode, error.code, error.message, error.details)
  }

  if (error instanceof Error) {
    console.error("[v0] Unhandled error:", error)
    return createErrorResponse(500, ErrorCodes.INTERNAL_ERROR, error.message)
  }

  console.error("[v0] Unknown error:", error)
  return createErrorResponse(500, ErrorCodes.INTERNAL_ERROR, "An unexpected error occurred")
}
