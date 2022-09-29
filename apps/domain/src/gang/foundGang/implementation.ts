import { create as createGangId } from './gangId'
import { FactionId, create as createFactionId } from './factionId'
import { create as createString50 } from './string50'
import { pipe } from 'fp-ts/function'
import {
  CheckFactionExists,
  UnvalidatedGang,
  ValidatedGang,
  FoundGangEvent,
} from './types'

type ValidateGang = (
  checkFactionExists: CheckFactionExists
) => (unvalidatedGang: UnvalidatedGang) => ValidatedGang
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
    const id = createGangId()
    const name = pipe(unvalidatedGang.name, createString50)
    const factionId = pipe(
      unvalidatedGang.factionId,
      toValidFactionId(checkFactionExists)
    )

    return {
      id,
      name,
      factionId,
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
