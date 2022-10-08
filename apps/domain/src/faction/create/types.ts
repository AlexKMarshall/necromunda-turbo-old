import { FactionId } from './factionId'
import { FactionValidationError, UniqueFactionName } from './implementation'
import * as E from 'fp-ts/Either'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'

/*
 * External dependencies / DB Functions
 */

export type CheckFactionNameExists = (name: string) => T.Task<boolean>
export type CheckFactionNameExistsTE<E = never> = (
  name: string
) => TE.TaskEither<E, boolean>

/*
 * Public API
 */

export type UnvalidatedFaction = {
  name: string
}

export type ValidatedFaction = {
  name: UniqueFactionName
  id: FactionId
}

export type FactionCreated = {
  event: 'factionCreated'
  details: ValidatedFaction
}

export type CreateFactionEvent = FactionCreated

export type CreateFactionError = FactionValidationError

export type CreateFactionSuccess = {
  factionCreated: ValidatedFaction
  events: CreateFactionEvent[]
}

export type CreateFactionDependencies = {
  checkFactionNameExists: CheckFactionNameExists
}
export type CreateFactionDependenciesTE<E> = {
  checkFactionNameExists: CheckFactionNameExistsTE<E>
}

export type CreateFaction = (
  dependencies: CreateFactionDependencies
) => (
  unvalidatedFaction: UnvalidatedFaction
) => TE.TaskEither<CreateFactionError, CreateFactionEvent[]>

export type CreateFactionTE<NonDomainError = never> = (
  unvalidatedFaction: UnvalidatedFaction
) => TE.TaskEither<CreateFactionError | NonDomainError, CreateFactionSuccess>
