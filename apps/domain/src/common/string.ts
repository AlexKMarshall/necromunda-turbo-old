import { pipe } from 'fp-ts/lib/function'
import * as t from 'io-ts'
import * as D from 'io-ts/Decoder'

export type MinBrand<N extends number> = {
  readonly Min: unique symbol
  readonly min: N
}

export type Min<N extends number> = string & MinBrand<N>

export const min = <N extends number>(min: N) =>
  D.fromRefinement(
    (s: string): s is Min<N> => s.length >= min,
    `at lest ${min} characters long`
  )

export type MaxBrand<N extends number> = {
  readonly Max: unique symbol
  readonly max: N
}

export type Max<N extends number> = string & MaxBrand<N>

export const max = <N extends number>(max: N) =>
  D.fromRefinement(
    (s: string): s is Max<N> => s.length <= max,
    `at most ${max} characters long`
  )

export const between = <Low extends number, Hi extends number>(
  low: Low,
  hi: Hi
) => pipe(min(low), D.intersect(max(hi)))
