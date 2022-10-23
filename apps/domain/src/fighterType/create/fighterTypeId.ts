import { UUID, generate as generateUUID } from '../../common/uuid'
import * as D from 'io-ts/Decoder'
import { pipe } from 'fp-ts/lib/function'

type FighterTypeIdBrand = {
  readonly FighterTypeId: unique symbol
}

export type FighterTypeId = UUID & FighterTypeIdBrand

export const FighterTypeId: D.Decoder<unknown, FighterTypeId> = pipe(
  UUID,
  D.refine((s): s is FighterTypeId => true, 'FighterTypeId')
)

export const generate: () => FighterTypeId = () =>
  generateUUID() as FighterTypeId
