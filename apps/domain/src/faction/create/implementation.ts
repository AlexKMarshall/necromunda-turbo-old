import { flow, pipe } from 'fp-ts/lib/function'
import * as FactionId from './factionId'
import {
  // UnvalidatedFaction,
  CreateFactionEvent,
  // CheckFactionNameExistsTE,
} from './types'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import * as D from 'io-ts/Decoder'
import * as S from '../../common/string'
import { FactionDecodingError, FactionNameAlreadyExistsError } from './errors'

export type UnvalidatedFaction = {
  name: string
}

const FactionDecoder = D.struct({
  name: pipe(D.string, D.compose(S.between(2, 50))),
})

type FactionDecoded = D.TypeOf<typeof FactionDecoder>

type FactionName = FactionDecoded['name']

export type CheckFactionNameExistsTE<NonDomainError> = (
  name: FactionName
) => TE.TaskEither<NonDomainError, boolean>

type UniqueFactionNameBrand = {
  readonly UniqueFactionName: unique symbol
}

export type UniqueFactionName = FactionName & UniqueFactionNameBrand

const _tagUniqueFactionName = (name: FactionName): UniqueFactionName =>
  name as UniqueFactionName

const toUniqueFactionName =
  <E>(checkFactionNameExists: CheckFactionNameExistsTE<E>) =>
  (name: FactionName) => {
    return pipe(
      name,
      TE.right,
      TE.chainFirstW(
        flow(
          checkFactionNameExists,
          TE.filterOrElseW(
            (exists) => exists === false,
            () => FactionNameAlreadyExistsError.of(name)
          )
        )
      ),
      TE.map(_tagUniqueFactionName)
    )
  }

export type ValidatedFaction = FactionDecoded & {
  name: UniqueFactionName
  id: FactionId.FactionId
}

export const validateFaction =
  <E>(checkFactionNameExists: CheckFactionNameExistsTE<E>) =>
  (
    faction: UnvalidatedFaction
  ): TE.TaskEither<E | FactionValidationError, ValidatedFaction> => {
    return pipe(
      faction,
      FactionDecoder.decode,
      E.mapLeft(FactionDecodingError.of),
      TE.fromEither,
      TE.chainW(({ name, ...rest }) =>
        pipe(
          TE.Do,
          TE.apS('name', toUniqueFactionName(checkFactionNameExists)(name)),
          TE.apS('id', TE.right(FactionId.generate())),
          TE.apS('rest', TE.right(rest)),
          TE.map(({ name, rest, id }) => ({ name, id, ...rest }))
        )
      )
    )
  }

export type FactionValidationError =
  | FactionDecodingError
  | FactionNameAlreadyExistsError

type CreateEvents = (validatedFaction: ValidatedFaction) => CreateFactionEvent[]

export const createEvents: CreateEvents = (validatedFaction) => {
  return [{ event: 'factionCreated', details: validatedFaction }]
}
