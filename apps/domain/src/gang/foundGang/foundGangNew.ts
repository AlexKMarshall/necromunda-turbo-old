import { GangId, create as createGangId } from './gangId'
import { FactionId, create as createFactionId } from './factionId'
import { String50, create as createString50 } from './string50'
import { Opaque } from 'type-fest'
import { pipe } from 'fp-ts/function'

// Public API

export type UnvalidatedGang = {
  factionId: string
  name: string
}

export type ValidatedGang = {
  id: GangId
  factionId: FactionId
  name: String50
}

export type GangFounded = {
  event: 'gangFounded'
  details: ValidatedGang
}

export type FoundGangEvent = GangFounded

export type FoundGang = (unvalidatedGang: UnvalidatedGang) => FoundGangEvent[]

// Implementation Details types

type CheckFactionExists = (factionId: FactionId) => boolean
type ValidateGang = (
  checkFactionExists: CheckFactionExists
) => (unvalidatedGang: UnvalidatedGang) => ValidatedGang
type Predicate<T> = (x: T) => boolean

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
    const name = createString50(unvalidatedGang.name)
    const factionId = toValidFactionId(checkFactionExists)(
      unvalidatedGang.factionId
    )
    return {
      id,
      name,
      factionId,
    }
  }
