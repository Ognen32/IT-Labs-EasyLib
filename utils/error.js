export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}
