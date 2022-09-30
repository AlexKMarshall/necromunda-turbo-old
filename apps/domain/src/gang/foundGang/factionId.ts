import * as UUID from '../../common/uuid'
import * as E from 'fp-ts/Either'

export type FactionId = string

type Create = (factionId: string) => E.Either<UUID.InvalidUUIDError, FactionId>

export const create: Create = (factionId) => {
  return UUID.parse(factionId)
}
