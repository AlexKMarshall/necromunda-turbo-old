import { pipe } from 'fp-ts/lib/function'
import { createEvents, validateFaction } from './implementation'
import * as TE from 'fp-ts/TaskEither'
import { CreateFactionDependenciesTE, CreateFactionTE } from './types'

export const createFaction =
  <E = never>({
    checkFactionNameExists,
  }: CreateFactionDependenciesTE<E>): CreateFactionTE<E> =>
  (unvalidatedFaction) => {
    return pipe(
      unvalidatedFaction,
      validateFaction(checkFactionNameExists),
      TE.map((validatedFaction) => ({
        factionCreated: validatedFaction,
        events: createEvents(validatedFaction),
      }))
    )
  }
