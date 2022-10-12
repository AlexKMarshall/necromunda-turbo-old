import * as D from 'io-ts/Decoder'

export class FactionDecodingError extends Error {
  public _tag: 'FactionDecodingError'
  public decodeError: D.DecodeError
  constructor(error: D.DecodeError) {
    super('error decoding faction')
    this._tag = 'FactionDecodingError'
    this.decodeError = error
  }

  public static of(error: D.DecodeError) {
    return new FactionDecodingError(error)
  }
}

export class FactionNameAlreadyExistsError extends Error {
  public _tag: 'FactionNameAlreadyExistsError'
  private constructor(name: string) {
    super(`Faction name: ${name} aready exists`)
    this._tag = 'FactionNameAlreadyExistsError'
  }

  public static of(name: string) {
    return new FactionNameAlreadyExistsError(name)
  }
}
