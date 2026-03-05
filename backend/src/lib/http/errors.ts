export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const badRequest = (m = "Bad Request") => new HttpError(400, m);
export const unauthorized = (m = "Unauthorized") => new HttpError(401, m);
export const forbidden = (m = "Forbidden") => new HttpError(403, m);
export const notFound = (m = "Not Found") => new HttpError(404, m);
export const tooManyRequests = (m = "Too Many Requests") =>
  new HttpError(429, m);

export function isHttpError(error: unknown): error is HttpError {
  return (
    error instanceof HttpError ||
    (typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof (error as { status: unknown }).status === "number")
  );
}

export function getErrorStatus(error: unknown, fallback = 400): number {
  return isHttpError(error) ? error.status : fallback;
}
