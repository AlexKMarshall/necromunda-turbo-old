import { pipe } from 'fp-ts/lib/function'
import * as D from 'io-ts/Decoder'

type IntegerBrand = {
  readonly Integer: unique symbol
}

export type Integer = number & IntegerBrand

export const Integer: D.Decoder<unknown, Integer> = pipe(
  D.number,
  D.refine((n): n is Integer => Math.floor(n) === n, 'Integer')
)

type MinBrand<N extends number> = {
  readonly Min: unique symbol
  readonly min: N
}

export type Min<N extends number> = number & MinBrand<N>

export const min = <N extends number>(min: N) =>
  D.fromRefinement((s: number): s is Min<N> => s >= min, `at least ${min}`)

type MaxBrand<N extends number> = {
  readonly Max: unique symbol
  readonly max: N
}

export type Max<N extends number> = number & MaxBrand<N>
export const max = <N extends number>(max: N) =>
  D.fromRefinement((n: number): n is Max<N> => n <= max, `at most ${max}`)

export const PositiveInteger = pipe(D.number, D.compose(min(0)))
export type PositiveInteger = D.TypeOf<typeof PositiveInteger>
