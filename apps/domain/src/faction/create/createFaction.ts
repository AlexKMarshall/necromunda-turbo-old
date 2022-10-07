import { pipe } from 'fp-ts/lib/function'
import { createEvents, validateFaction } from './implementation'
import * as TE from 'fp-ts/TaskEither'
import { CreateFaction } from './types'

export const createFaction: CreateFaction =
  ({ checkFactionNameExists }) =>
  (unvalidatedFaction) => {
    return pipe(
      unvalidatedFaction,
      validateFaction(checkFactionNameExists),
      TE.map(createEvents)
    )
  }
