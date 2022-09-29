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

type ValidateGang = (unvalidatedGang: UnvalidatedGang) => ValidatedGang
type CheckFactionExists = (factionId: FactionId) => boolean
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

const validateGang: ValidateGang = (unvalidatedGang) => {
  const id = createGangId()
  const name = createString50(unvalidatedGang.name)
  const factionId = createFactionId(unvalidatedGang.factionId)
  return {
    id,
    name,
    factionId,
  }
}
