import { create as createGangId } from './gangId'
import { FactionId, create as createFactionId } from './factionId'
import { create as createString50 } from '../../common/string50'
import { pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import {
  CheckFactionExists,
  UnvalidatedGang,
  ValidatedGang,
  FoundGangEvent,
} from './types'

type ValidateGang = (
  checkFactionExists: CheckFactionExists
) => (
  unvalidatedGang: UnvalidatedGang
) => E.Either<GangValidationError, ValidatedGang>
type Predicate<T> = (x: T) => boolean
type CreateEvents = (validatedGang: ValidatedGang) => FoundGangEvent[]

const predicateToPassThru =
  <T>(errorMessage: string) =>
  (predicate: Predicate<T>) =>
  (value: T): T => {
    if (predicate(value)) return value
    throw new Error(errorMessage)
  }

export const toValidFactionId =
  (checkFactionExists: CheckFactionExists) =>
  (factionId: string): FactionId => {
    const checkFaction = (factionId: FactionId) => {
      const errorMessage = `Invalid factionId: ${factionId}`
      return predicateToPassThru<FactionId>(errorMessage)(checkFactionExists)(
        factionId
      )
    }

    return pipe(factionId, createFactionId, checkFaction)
  }

export const validateGang: ValidateGang =
  (checkFactionExists) => (unvalidatedGang) => {
    try {
      const id = createGangId()
      const name = pipe(unvalidatedGang.name, createString50('name'))
      const factionId = pipe(
        unvalidatedGang.factionId,
        toValidFactionId(checkFactionExists)
      )

      return E.right({
        id,
        name,
        factionId,
      })
    } catch {
      return E.left(GangValidationError.of())
    }
  }

export const createEvents: CreateEvents = (validatedGang) => {
  return [
    {
      event: 'gangFounded',
      details: validatedGang,
    },
  ]
}

export class GangValidationError extends Error {
  public _tag: 'GangValidationError'

  private constructor() {
    super('Gang fails validation')
    this._tag = 'GangValidationError'
  }

  public static of(): GangValidationError {
    return new GangValidationError()
  }
}
