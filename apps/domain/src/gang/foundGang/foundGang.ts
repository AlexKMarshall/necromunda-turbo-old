import { pipe } from 'fp-ts/function'
import { FoundGang } from './types'
import { validateGang, createEvents } from './implementation'

export const foundGang: FoundGang =
  ({ checkFactionExists }) =>
  (unvalidatedGang) => {
    const _validateGang = validateGang(checkFactionExists)

    return pipe(unvalidatedGang, _validateGang, createEvents)
  }
