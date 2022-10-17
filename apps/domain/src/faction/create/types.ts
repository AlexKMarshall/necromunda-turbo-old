import {
  FactionValidationError,
  ValidatedFaction,
  FactionName,
  UnvalidatedFaction,
} from './implementation'
import * as TE from 'fp-ts/TaskEither'

/*
 * External dependencies / DB Functions
 */

export type CheckFactionNameExistsTE<E = never> = (
  name: FactionName
) => TE.TaskEither<E, boolean>

/*
 * Public API
 */

export type { ValidatedFaction, UnvalidatedFaction }

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

export type CreateFactionDependenciesTE<E> = {
  checkFactionNameExists: CheckFactionNameExistsTE<E>
}

export type CreateFactionTE<NonDomainError = never> = (
  unvalidatedFaction: UnvalidatedFaction
) => TE.TaskEither<CreateFactionError | NonDomainError, CreateFactionSuccess>
