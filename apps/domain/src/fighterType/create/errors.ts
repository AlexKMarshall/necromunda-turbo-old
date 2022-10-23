import * as D from 'io-ts/Decoder'

export class FighterTypeDecodingError extends Error {
  public _tag: 'FighterTypeDecodingError'
  public decodeError: D.DecodeError
  constructor(error: D.DecodeError) {
    super('error decoding fighter type')
    this._tag = 'FighterTypeDecodingError'
    this.decodeError = error
  }

  public static of(error: D.DecodeError) {
    return new FighterTypeDecodingError(error)
  }
}

export class FactionDoesNotExistError extends Error {
  public _tag: 'FactionDoesNotExistError'

  private constructor(factionId: string) {
    super(`Faction: ${factionId} does not exist`)
    this._tag = 'FactionDoesNotExistError'
  }

  public static of(factionId: string): FactionDoesNotExistError {
    return new FactionDoesNotExistError(factionId)
  }
}

export class FighterTypeNameAlreadyExistsError extends Error {
  public _tag: 'FighterTypeNameAlreadyExistsError'
  private constructor(name: string) {
    super(`Fighter type name: ${name} aready exists`)
    this._tag = 'FighterTypeNameAlreadyExistsError'
  }

  public static of(name: string) {
    return new FighterTypeNameAlreadyExistsError(name)
  }
}
