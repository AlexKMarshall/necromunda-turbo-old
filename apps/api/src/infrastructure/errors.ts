export class DBError extends Error {
  public _tag: 'DBError'
  public innerError?: unknown

  private constructor(innerError?: unknown) {
    super('Unexpected database error')
    this.innerError = innerError
    this._tag = 'DBError'
  }

  public static of(innerError?: unknown) {
    return new DBError(innerError)
  }
}
