import { flow, pipe } from 'fp-ts/lib/function'
import * as FactionId from './factionId'
import {
  UnvalidatedFaction,
  CreateFactionEvent,
  CheckFactionNameExistsTE,
} from './types'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import * as D from 'io-ts/Decoder'
import * as S from '../../common/string'

const FactionDecoder = D.struct({
  name: pipe(D.string, D.compose(S.between(2, 50))),
})

type FactionDecoded = D.TypeOf<typeof FactionDecoder>

export type FactionName = FactionDecoded['name']

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
          TE.filterOrElseW(Boolean, () =>
            FactionNameAlreadyExistsError.of(name)
          )
        )
      ),
      TE.map(_tagUniqueFactionName)
    )
  }

class FactionDecodingError extends Error {
  public _tag: 'FactionDecodingError'
  public decodeError: D.DecodeError
  constructor(error: D.DecodeError) {
    super('error decoding faction')
    this._tag = 'FactionDecodingError'
    this.decodeError = error
  }

  public static of(error: D.DecodeError) {
    return new FactionDecodingError(error)
  }
}

export type ValidatedFaction = FactionDecoded & {
  name: UniqueFactionName
  id: FactionId.FactionId
}

//
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

// const _tag = (name: FactionName.FactionName): UniqueFactionName =>
//   FactionName.value(name) as UniqueFactionName

// export type UniqueFactionName = Opaque<string, 'UniqueFactionName'>

// const toUniqueFactionName =
//   <E = never>(checkFactionNameExists: CheckFactionNameExistsTE<E>) =>
//   (name: FactionName.FactionName) => {
//     return pipe(
//       name,
//       checkFactionNameExists,
//       TE.chainW((exists) =>
//         exists
//           ? pipe(name, FactionNameAlreadyExistsError.of, TE.left)
//           : pipe(name, _tag, TE.right)
//       )
//     )
//   }

// export const toValidFactionNameTE = <E = never>(
//   checkFactionNameExists: CheckFactionNameExistsTE<E>
// ) =>
//   flow(
//     FactionName.parse('name'),
//     TE.fromEither,
//     TE.chainW(toUniqueFactionName(checkFactionNameExists))
//   )

// export const validateFactionTE =
//   <E = never>(
//     checkFactionNameExists: CheckFactionNameExistsTE<E>
//   ): ValidateFaction<E> =>
//   (unvalidatedFaction) => {
//     return pipe(unvalidatedFaction, ({ name }) =>
//       sequenceS(TE.ApplySeq)({
//         id: pipe(FactionId.create(), TE.right),
//         name: pipe(name, toValidFactionNameTE(checkFactionNameExists)),
//       })
//     )
//   }

type CreateEvents = (validatedFaction: ValidatedFaction) => CreateFactionEvent[]

export const createEvents: CreateEvents = (validatedFaction) => {
  return [{ event: 'factionCreated', details: validatedFaction }]
}
