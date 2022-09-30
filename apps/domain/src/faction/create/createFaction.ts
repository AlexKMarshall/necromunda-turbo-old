import { pipe } from 'fp-ts/lib/function'
import {
  createEvents,
  validateFaction,
  validateFactionT,
} from './implementation'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { CreateFaction, CreateFactionT } from './types'

export const createFaction: CreateFaction =
  ({ checkFactionNameExists }) =>
  (unvalidatedFaction) => {
    return pipe(
      unvalidatedFaction,
      validateFaction(checkFactionNameExists),
      E.map(createEvents)
    )
  }

export const createFactionT: CreateFactionT =
  ({ checkFactionNameExists }) =>
  (unvalidatedFaction) => {
    return pipe(
      unvalidatedFaction,
      validateFactionT(checkFactionNameExists),
      TE.map(createEvents)
    )
  }
