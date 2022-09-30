import { create as createGangId } from './gangId'
import { FactionId, create as createFactionId } from './factionId'
import { create as createString50 } from '../../common/string50'
import { pipe } from 'fp-ts/function'
import { sequenceS } from 'fp-ts/lib/Apply'
import * as E from 'fp-ts/Either'
import {
  CheckFactionExists,
  UnvalidatedGang,
  ValidatedGang,
  FoundGangEvent,
} from './types'
import { InvalidUUIDError } from '../../common/uuid'

type ValidateGang = (
  checkFactionExists: CheckFactionExists
) => (
  unvalidatedGang: UnvalidatedGang
) => E.Either<GangValidationError, ValidatedGang>
type CreateEvents = (validatedGang: ValidatedGang) => FoundGangEvent[]

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

export const toValidFactionId =
  (checkFactionExists: CheckFactionExists) =>
  (
    factionId: string
  ): E.Either<FactionDoesNotExistError | InvalidUUIDError, FactionId> => {
    const checkFaction = (factionId: FactionId) => {
      if (checkFactionExists(factionId)) {
        return E.right(factionId)
      }
      return E.left(FactionDoesNotExistError.of(factionId))
    }

    return pipe(factionId, createFactionId, E.chainW(checkFaction))
  }

export const validateGang: ValidateGang =
  (checkFactionExists) => (unvalidatedGang) => {
    return pipe(unvalidatedGang, ({ name, factionId }) =>
      sequenceS(E.Apply)({
        id: createGangId(),
        name: pipe(name, createString50('name'), E.right),
        factionId: pipe(factionId, toValidFactionId(checkFactionExists)),
      })
    )
  }

export const createEvents: CreateEvents = (validatedGang) => {
  return [
    {
      event: 'gangFounded',
      details: validatedGang,
    },
  ]
}

export type GangValidationError = FactionDoesNotExistError | InvalidUUIDError
