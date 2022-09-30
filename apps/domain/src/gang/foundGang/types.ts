import { FactionId } from './factionId'
import { GangId } from './gangId'
import { String50 } from '../../common/string50'
import { GangValidationError } from './implementation'
import * as E from 'fp-ts/Either'

/**
 * External dependencies
 */

export type CheckFactionExists = (factionId: FactionId) => boolean

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

export type FoundGangDependencies = {
  checkFactionExists: CheckFactionExists
}
export type FoundGang = (
  dependencies: FoundGangDependencies
) => (
  unvalidatedGang: UnvalidatedGang
) => E.Either<FoundGangError, FoundGangEvent[]>
