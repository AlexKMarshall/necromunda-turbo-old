import * as UUID from '../../common/uuid'
import * as E from 'fp-ts/Either'
import { Opaque, UnwrapOpaque } from 'type-fest'
import { pipe } from 'fp-ts/lib/function'

export type GangId = Opaque<UnwrapOpaque<UUID.UUID>>

const _tag = (gangId: UUID.UUID): GangId => UUID.value(gangId) as GangId

type Create = () => GangId

export const create: Create = () => {
  return pipe(UUID.create(), _tag)
}
