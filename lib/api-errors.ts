import { ZodError } from "zod";

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "INTERNAL_ERROR";

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

export function validationErrorResponse(error: ZodError): ApiErrorBody {
  return {
    error: {
      code: "VALIDATION_ERROR",
      message: "Request validation failed",
      details: error.errors.map((issue) => ({
        field: issue.path.join(".") || "body",
        message: issue.message,
      })),
    },
  };
}

export function notFoundResponse(message = "Resource not found"): ApiErrorBody {
  return {
    error: {
      code: "NOT_FOUND",
      message,
    },
  };
}
