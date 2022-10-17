import * as D from 'io-ts/Decoder'

export class GangDecodingError extends Error {
  public _tag: 'GangDecodingError'
  public decodeError: D.DecodeError
  constructor(error: D.DecodeError) {
    super('error decoding gang')
    this._tag = 'GangDecodingError'
    this.decodeError = error
  }

  public static of(error: D.DecodeError) {
    return new GangDecodingError(error)
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
