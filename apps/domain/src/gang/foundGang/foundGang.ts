import { pipe } from 'fp-ts/function'
import { FoundGang } from './types'
import { validateGang, createEvents } from './implementation'
import * as E from 'fp-ts/Either'

export const foundGang: FoundGang =
  ({ checkFactionExists }) =>
  (unvalidatedGang) => {
    const _validateGang = validateGang(checkFactionExists)

    return pipe(unvalidatedGang, _validateGang, E.map(createEvents))
  }
