import { sequenceS } from 'fp-ts/lib/Apply'
import { flow, pipe } from 'fp-ts/lib/function'
import * as FactionId from './factionId'
import { ConstrainedStringError } from '../../common/constrained'
import { Opaque } from 'type-fest'
import * as FactionName from './name'
import {
  UnvalidatedFaction,
  ValidatedFaction,
  CreateFactionEvent,
  CheckFactionNameExistsTE,
} from './types'
import * as TE from 'fp-ts/TaskEither'

export type FactionValidationError =
  | ConstrainedStringError
  | FactionNameAlreadyExistsError

type ValidateFaction<E = never> = (
  unvalidatedFaction: UnvalidatedFaction
) => TE.TaskEither<FactionValidationError | E, ValidatedFaction>

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
  <E = never>(checkFactionNameExists: CheckFactionNameExistsTE<E>) =>
  (name: FactionName.FactionName) => {
    return pipe(
      name,
      checkFactionNameExists,
      TE.chainW((exists) =>
        exists
          ? pipe(name, FactionNameAlreadyExistsError.of, TE.left)
          : pipe(name, _tag, TE.right)
      )
    )
  }

export const toValidFactionNameTE = <E = never>(
  checkFactionNameExists: CheckFactionNameExistsTE<E>
) =>
  flow(
    FactionName.parse('name'),
    TE.fromEither,
    TE.chainW(toUniqueFactionName(checkFactionNameExists))
  )

export const validateFactionTE =
  <E = never>(
    checkFactionNameExists: CheckFactionNameExistsTE<E>
  ): ValidateFaction<E> =>
  (unvalidatedFaction) => {
    return pipe(unvalidatedFaction, ({ name }) =>
      sequenceS(TE.ApplySeq)({
        id: pipe(FactionId.create(), TE.right),
        name: pipe(name, toValidFactionNameTE(checkFactionNameExists)),
      })
    )
  }

type CreateEvents = (validatedFaction: ValidatedFaction) => CreateFactionEvent[]

export const createEvents: CreateEvents = (validatedFaction) => {
  return [{ event: 'factionCreated', details: validatedFaction }]
}
