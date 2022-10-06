import { pipe } from 'fp-ts/lib/function'
import { Opaque } from 'type-fest'
import { FactionId } from './factionId'
import {
  createEvents,
  FactionValidationError,
  UniqueFactionName,
  validateFaction,
} from './implementation'
import * as E from 'fp-ts/Either'

export type UnvalidatedFaction = {
  name: string
}

export type FactionName = Opaque<string, 'FactionName'>

export type ValidatedFaction = {
  name: UniqueFactionName
  id: FactionId
}

export type FactionCreated = {
  event: 'factionCreated'
  details: ValidatedFaction
}

export type CreateFactionEvent = FactionCreated

export type CheckFactionExists = (name: string) => boolean

export type CreateFactionDependencies = {
  checkFactionExists: CheckFactionExists
}

export type CreateFactionError = FactionValidationError

export type CreateFaction = (
  dependencies: CreateFactionDependencies
) => (
  unvalidatedFaction: UnvalidatedFaction
) => E.Either<CreateFactionError, CreateFactionEvent[]>

export const createFaction: CreateFaction =
  ({ checkFactionExists }) =>
  (unvalidatedFaction) => {
    return pipe(
      unvalidatedFaction,
      validateFaction(checkFactionExists),
      E.map(createEvents)
    )
  }
