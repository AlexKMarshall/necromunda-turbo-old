import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/TaskEither'
import {
  FighterTypeValidationError,
  UnvalidatedFighterType,
  ValidatedFighterType,
  validateFighterType,
  ValidateFighterTypeDependencies,
} from './implementation'

type CreateFighterTypeDependencies<E1, E2> = ValidateFighterTypeDependencies<
  E1,
  E2
>
type CreateFighterTypeError = FighterTypeValidationError
type CreateFighterTypeSuccess = {
  fighterTypeCreated: ValidatedFighterType
}

export const createFighterType =
  <E1, E2>(deps: CreateFighterTypeDependencies<E1, E2>) =>
  (
    unvalidatedFighterType: UnvalidatedFighterType
  ): TE.TaskEither<
    E1 | E2 | CreateFighterTypeError,
    CreateFighterTypeSuccess
  > =>
    pipe(
      unvalidatedFighterType,
      validateFighterType(deps),
      TE.map((validatedFighterType) => ({
        fighterTypeCreated: validatedFighterType,
      }))
    )
