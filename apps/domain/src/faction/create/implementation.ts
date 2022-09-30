import { sequenceS } from 'fp-ts/lib/Apply'
import { flow, pipe } from 'fp-ts/lib/function'
import * as E from 'fp-ts/Either'
import * as String50 from '../../common/string50'
import {
  CreateFactionEvent,
  UnvalidatedFaction,
  ValidatedFaction,
} from './createFaction'
import * as FactionId from './factionId'
import { ConstrainedStringError } from '../../common/constrained'
import { Opaque } from 'type-fest'
import * as FactionName from './name'

export type FactionValidationError =
  | ConstrainedStringError
  | FactionNameAlreadyExistsError

type ValidateFaction = (
  checkFactionExists: CheckFactionExists
) => (
  unvalidatedFaction: UnvalidatedFaction
) => E.Either<FactionValidationError, ValidatedFaction>

type CheckFactionExists = (name: string) => boolean

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
  (checkFactionExists: CheckFactionExists) =>
  (
    name: FactionName.FactionName
  ): E.Either<FactionNameAlreadyExistsError, UniqueFactionName> => {
    if (checkFactionExists(name)) {
      return pipe(name, FactionNameAlreadyExistsError.of, E.left)
    }
    return pipe(name, _tag, E.right)
  }

export const toValidFactionName = (checkFactionExists: CheckFactionExists) =>
  flow(
    FactionName.parse('name'),
    E.chainW(toUniqueFactionName(checkFactionExists))
  )

export const validateFaction: ValidateFaction =
  (checkFactionExists) => (unvalidatedFaction) => {
    return pipe(unvalidatedFaction, ({ name }) =>
      sequenceS(E.Apply)({
        id: pipe(FactionId.create(), E.right),
        name: pipe(name, toValidFactionName(checkFactionExists)),
      })
    )
  }

type CreateEvents = (validatedFaction: ValidatedFaction) => CreateFactionEvent[]

export const createEvents: CreateEvents = (validatedFaction) => {
  return [{ event: 'factionCreated', details: validatedFaction }]
}
