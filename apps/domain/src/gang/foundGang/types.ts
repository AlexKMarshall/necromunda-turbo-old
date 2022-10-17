import { FactionId } from '../../faction'
import {
  GangValidationError,
  UnvalidatedGang,
  ValidatedGang,
} from './implementation'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'

/**
 * External dependencies
 */

export type CheckFactionIDExists<NonDomainError> = (
  factionId: FactionId
) => TE.TaskEither<NonDomainError, boolean>

/**
 * Contains the types of the public API
 */

export type { UnvalidatedGang, ValidatedGang }

export type GangFounded = {
  event: 'gangFounded'
  details: ValidatedGang
}

export type FoundGangEvent = GangFounded

export type FoundGangError = GangValidationError
export type FoundGangSuccess = {
  gangFounded: ValidatedGang
}

export type FoundGangDependencies<NonDomainError> = {
  checkFactionIdExists: CheckFactionIDExists<NonDomainError>
}
