import * as UUID from '../../common/uuid-old'
import * as E from 'fp-ts/Either'
import { Opaque, UnwrapOpaque } from 'type-fest'
import { pipe } from 'fp-ts/lib/function'

export type FactionId = Opaque<UnwrapOpaque<UUID.UUID>, 'FactionId'>

type Create = (factionId: string) => E.Either<UUID.InvalidUUIDError, FactionId>

const _tag = (factionId: UUID.UUID): FactionId =>
  UUID.value(factionId) as FactionId

export const parse: Create = (factionId) => {
  return pipe(factionId, UUID.parse, E.map(_tag))
}
