import { pipe } from 'fp-ts/lib/function'
import * as D from 'io-ts/Decoder'

type FighterCategoryBrand = {
  readonly FighterCategory: unique symbol
}
const fighterCategories = ['leader', 'specialist', 'ganger', 'juve'] as const

export type FighterCategory = typeof fighterCategories[number] &
  FighterCategoryBrand

export const FighterCategory: D.Decoder<unknown, FighterCategory> = pipe(
  D.string,
  D.refine(
    (s): s is FighterCategory => fighterCategories.includes(s as any),
    'FighterCategory'
  )
)
