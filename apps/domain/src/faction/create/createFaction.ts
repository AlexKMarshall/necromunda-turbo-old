import { pipe } from 'fp-ts/lib/function'
import { createEvents, validateFactionT } from './implementation'
import * as TE from 'fp-ts/TaskEither'
import { CreateFactionT } from './types'

export const createFaction: CreateFactionT =
  ({ checkFactionNameExists }) =>
  (unvalidatedFaction) => {
    return pipe(
      unvalidatedFaction,
      validateFactionT(checkFactionNameExists),
      TE.map(createEvents)
    )
  }
