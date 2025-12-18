export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public statusText: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.statusText = statusText;
  }
}
