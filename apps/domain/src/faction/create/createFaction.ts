import { pipe } from 'fp-ts/lib/function'
import { createEvents, validateFaction } from './implementation'
import * as E from 'fp-ts/Either'
import { CreateFaction } from './types'

export const createFaction: CreateFaction =
  ({ checkFactionNameExists }) =>
  (unvalidatedFaction) => {
    return pipe(
      unvalidatedFaction,
      validateFaction(checkFactionNameExists),
      E.map(createEvents)
    )
  }
