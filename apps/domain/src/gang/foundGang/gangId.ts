import { UUID, generate as generateUUID } from '../../common/uuid'
import * as D from 'io-ts/Decoder'
import { pipe } from 'fp-ts/lib/function'

type GangIdBrand = {
  readonly GangId: unique symbol
}

export type GangId = UUID & GangIdBrand

export const GangId: D.Decoder<unknown, GangId> = pipe(
  UUID,
  D.refine((s): s is GangId => true, 'GangId')
)

export const generate: () => GangId = () => generateUUID() as GangId
