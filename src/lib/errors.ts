import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function toAppError(error: unknown) {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof ZodError) {
    return new AppError(400, "VALIDATION_ERROR", "Invalid request payload.");
  }

  if (error instanceof Error) {
    const status = error.message.includes("environment variable") ? 503 : 500;
    const code = status === 503 ? "CONFIG_ERROR" : "INTERNAL_ERROR";
    return new AppError(status, code, error.message);
  }

  return new AppError(500, "INTERNAL_ERROR", "Unexpected server error.");
}
