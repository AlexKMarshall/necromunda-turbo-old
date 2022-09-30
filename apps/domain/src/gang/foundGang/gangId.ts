import * as UUID from '../../common/uuid'
import * as E from 'fp-ts/Either'

export type GangId = string

type Create = (gangId?: string) => E.Either<UUID.InvalidUUIDError, GangId>

export const create: Create = (gangId) => {
  return UUID.parse(gangId)
}
