export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const badRequest = (message = "Bad Request") => new HttpError(400, message);
export const unauthorized = (message = "Unauthorized") => new HttpError(401, message);
export const forbidden = (message = "Forbidden") => new HttpError(403, message);
export const notFound = (message = "Not Found") => new HttpError(404, message);
export const tooManyRequests = (message = "Too Many Requests") => new HttpError(429, message);

export function isHttpError(error: unknown): error is HttpError {
  return (
    error instanceof HttpError ||
    (typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof (error as { status: unknown }).status === "number")
  );
}

export function getErrorStatus(error: unknown, fallback = 400) {
  return isHttpError(error) ? error.status : fallback;
}
