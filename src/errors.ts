export class DefaultError extends Error {
  error: string = 'Unknown error';
  constructor(message: string) {
    super(message);

    this.error = message;
  }
}
