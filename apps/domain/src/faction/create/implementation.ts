import { sequenceS } from 'fp-ts/lib/Apply'
import { flow, pipe } from 'fp-ts/lib/function'
import * as E from 'fp-ts/Either'
import * as FactionId from './factionId'
import { ConstrainedStringError } from '../../common/constrained'
import { Opaque } from 'type-fest'
import * as FactionName from './name'
import {
  UnvalidatedFaction,
  ValidatedFaction,
  CreateFactionEvent,
  CheckFactionNameExists,
  CheckFactionNameExistsT,
} from './types'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'

export type FactionValidationError =
  | ConstrainedStringError
  | FactionNameAlreadyExistsError

type ValidateFaction = (
  checkFactionNameExists: CheckFactionNameExists
) => (
  unvalidatedFaction: UnvalidatedFaction
) => E.Either<FactionValidationError, ValidatedFaction>

type ValidateFactionT = (
  checkFactionNameExists: CheckFactionNameExistsT
) => (
  unvalidatedFaction: UnvalidatedFaction
) => TE.TaskEither<FactionValidationError, ValidatedFaction>

class FactionNameAlreadyExistsError extends Error {
  public _tag: 'FactionNameAlreadyExistsError'
  private constructor(name: string) {
    super(`Faction name: ${name} aready exists`)
    this._tag = 'FactionNameAlreadyExistsError'
  }

  public static of(name: string) {
    return new FactionNameAlreadyExistsError(name)
  }
}

const _tag = (name: FactionName.FactionName): UniqueFactionName =>
  FactionName.value(name) as UniqueFactionName

export type UniqueFactionName = Opaque<string, 'UniqueFactionName'>
const toUniqueFactionName =
  (checkFactionNameExists: CheckFactionNameExists) =>
  (
    name: FactionName.FactionName
  ): E.Either<FactionNameAlreadyExistsError, UniqueFactionName> => {
    if (checkFactionNameExists(name)) {
      return pipe(name, FactionNameAlreadyExistsError.of, E.left)
    }
    return pipe(name, _tag, E.right)
  }

const toUniqueFactionNameT =
  (checkFactionNameExists: CheckFactionNameExistsT) =>
  (
    name: FactionName.FactionName
  ): TE.TaskEither<FactionNameAlreadyExistsError, UniqueFactionName> => {
    return pipe(
      name,
      checkFactionNameExists,
      T.map((exists) =>
        exists
          ? pipe(name, FactionNameAlreadyExistsError.of, E.left)
          : pipe(name, _tag, E.right)
      )
    )
  }

export const toValidFactionName = (
  checkFactionNameExists: CheckFactionNameExists
) =>
  flow(
    FactionName.parse('name'),
    E.chainW(toUniqueFactionName(checkFactionNameExists))
  )

export const toValidFactionNameT = (
  checkFactionNameExists: CheckFactionNameExistsT
) =>
  flow(
    FactionName.parse('name'),
    TE.fromEither,
    TE.chainW(toUniqueFactionNameT(checkFactionNameExists))
  )

export const validateFaction: ValidateFactionT =
  (checkFactionExists) => (unvalidatedFaction) => {
    return pipe(unvalidatedFaction, ({ name }) =>
      sequenceS(TE.ApplySeq)({
        id: pipe(FactionId.create(), TE.right),
        name: pipe(name, toValidFactionNameT(checkFactionExists)),
      })
    )
  }

type CreateEvents = (validatedFaction: ValidatedFaction) => CreateFactionEvent[]

export const createEvents: CreateEvents = (validatedFaction) => {
  return [{ event: 'factionCreated', details: validatedFaction }]
}
