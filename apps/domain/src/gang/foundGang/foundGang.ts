import { pipe } from 'fp-ts/function'
import {
  FoundGangDependencies,
  FoundGangError,
  FoundGangSuccess,
} from './types'
import { UnvalidatedGang, validateGang } from './implementation'
import * as TE from 'fp-ts/TaskEither'

export const foundGang =
  <E>({ checkFactionIdExists }: FoundGangDependencies<E>) =>
  (
    unvalidatedGang: UnvalidatedGang
  ): TE.TaskEither<E | FoundGangError, FoundGangSuccess> =>
    pipe(
      unvalidatedGang,
      validateGang(checkFactionIdExists),
      TE.map((validatedGang) => ({ gangFounded: validatedGang }))
    )
