import { UUID, generate as generateUUID } from '../../common/uuid'
import * as D from 'io-ts/Decoder'
import { pipe } from 'fp-ts/lib/function'

type FactionIdBrand = {
  readonly FactionId: unique symbol
}

export type FactionId = UUID & FactionIdBrand

export const FactionId: D.Decoder<unknown, FactionId> = pipe(
  UUID,
  D.refine((s): s is FactionId => true, 'FactionId')
)

const _tag = (factionId: UUID): FactionId => factionId as FactionId

export const generate: () => FactionId = () => generateUUID() as FactionId
