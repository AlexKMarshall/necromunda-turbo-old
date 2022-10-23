import { pipe } from 'fp-ts/lib/function'
import * as D from 'io-ts/Decoder'
import { PositiveInteger } from './number'

type CreditsBrand = {
  readonly Credits: unique symbol
}

export type Credits = PositiveInteger & CreditsBrand

export const Credits: D.Decoder<unknown, Credits> = pipe(
  PositiveInteger,
  D.refine((n): n is Credits => true, 'Credits')
)
