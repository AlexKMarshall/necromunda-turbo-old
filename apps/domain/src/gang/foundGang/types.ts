import { FactionId } from './factionId'
import { GangId } from './gangId'
import { String50 } from '../../common/deprecated/string50-old'
import { GangValidationError } from './implementation'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'

/**
 * External dependencies
 */

export type CheckFactionExists = (factionId: FactionId) => boolean
export type CheckFactionIDExistsTE<NonDomainError = never> = (
  factionId: FactionId
) => TE.TaskEither<NonDomainError, boolean>

/**
 * Contains the types of the public API
 */

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

export type FoundGangError = GangValidationError
export type FoundGangSuccess = {
  gangFounded: ValidatedGang
  events: FoundGangEvent[]
}

export type FoundGangDependencies = {
  checkFactionExists: CheckFactionExists
}

export type FoundGangDependenciesTE<NonDomainError = never> = {
  checkFactionIdExists: CheckFactionIDExistsTE
}

export type FoundGang = (
  dependencies: FoundGangDependencies
) => (
  unvalidatedGang: UnvalidatedGang
) => E.Either<FoundGangError, FoundGangEvent[]>

export type FoundGangTE<NonDomainError = never> = (
  unvalidatedGang: UnvalidatedGang
) => TE.TaskEither<FoundGangError | NonDomainError, FoundGangSuccess>
