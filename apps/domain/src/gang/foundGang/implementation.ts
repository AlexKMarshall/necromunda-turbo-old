import { create as createGangId } from './gangId'
import { FactionId, parse as parseFactionId } from './factionId'
import { create as createString50 } from '../../common/string50'
import { flow, pipe } from 'fp-ts/function'
import { sequenceS } from 'fp-ts/lib/Apply'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import {
  CheckFactionExists,
  UnvalidatedGang,
  ValidatedGang,
  FoundGangEvent,
  CheckFactionIDExistsTE,
} from './types'
import { InvalidUUIDError } from '../../common/uuid'
import { ConstrainedStringError } from '../../common/constrained'

type ValidateGang = (
  checkFactionExists: CheckFactionExists
) => (
  unvalidatedGang: UnvalidatedGang
) => E.Either<GangValidationError, ValidatedGang>

type ValidateGangTE<NonDomainError = never> = (
  unvalidatedGang: UnvalidatedGang
) => TE.TaskEither<GangValidationError | NonDomainError, ValidatedGang>

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

    return pipe(factionId, parseFactionId, E.chainW(checkFaction))
  }

export const toValidFactionIdTE =
  <E = never>(checkFactionIdExists: CheckFactionIDExistsTE<E>) =>
  (factionId: string) => {
    const _checkFactionIdExists = (factionId: FactionId) =>
      pipe(
        factionId,
        checkFactionIdExists,
        TE.chainW((exists) =>
          exists
            ? TE.right(factionId)
            : TE.left(FactionDoesNotExistError.of(factionId))
        )
      )

    return pipe(
      factionId,
      parseFactionId,
      TE.fromEither,
      TE.chainW(_checkFactionIdExists)
    )
  }

export const validateGang: ValidateGang =
  (checkFactionExists) => (unvalidatedGang) => {
    return pipe(unvalidatedGang, ({ name, factionId }) =>
      sequenceS(E.Apply)({
        id: E.right(createGangId()),
        name: pipe(name, createString50('name')),
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

export type GangValidationError =
  | FactionDoesNotExistError
  | InvalidUUIDError
  | ConstrainedStringError
