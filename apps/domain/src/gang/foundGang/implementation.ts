import { GangId, generate as generateGangId } from './gangId'
import { flow, pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import * as D from 'io-ts/Decoder'
import * as S from '../../common/string'
import { FactionId } from 'src/faction'
import { FactionDoesNotExistError, GangDecodingError } from './errors'

type CheckFactionIdExists<NonDomainError> = (
  id: FactionId
) => TE.TaskEither<NonDomainError, boolean>

export type UnvalidatedGang = {
  name: string
  factionId: string
}

export type GangValidationError = FactionDoesNotExistError | GangDecodingError

const GangDecoder = D.struct({
  name: pipe(D.string, D.compose(S.between(2, 50))),
  factionId: FactionId,
})

type ExistingFactionIdBrand = {
  readonly ExistingFactionId: unique symbol
}

type ExistingFactionId = FactionId & ExistingFactionIdBrand

export type ValidatedGang = Omit<D.TypeOf<typeof GangDecoder>, 'factionId'> & {
  id: GangId
  factionId: ExistingFactionId
}

const _tagExistingFactionId = (factionId: FactionId) =>
  factionId as ExistingFactionId

const toExistingFactionId =
  <E>(checkFactionIdExists: CheckFactionIdExists<E>) =>
  (
    factionId: FactionId
  ): TE.TaskEither<E | FactionDoesNotExistError, ExistingFactionId> =>
    pipe(
      factionId,
      TE.right,
      TE.chainFirst(
        flow(
          checkFactionIdExists,
          TE.filterOrElseW(Boolean, () =>
            FactionDoesNotExistError.of(factionId)
          )
        )
      ),
      TE.map(_tagExistingFactionId)
    )

export const validateGang =
  <E>(checkFactionIdExists: CheckFactionIdExists<E>) =>
  (
    unvalidatedGang: UnvalidatedGang
  ): TE.TaskEither<E | GangValidationError, ValidatedGang> =>
    pipe(
      unvalidatedGang,
      GangDecoder.decode,
      E.mapLeft(GangDecodingError.of),
      TE.fromEither,
      TE.chainW(({ factionId, ...rest }) =>
        pipe(
          TE.Do,
          TE.apS(
            'factionId',
            toExistingFactionId(checkFactionIdExists)(factionId)
          ),
          TE.apS('id', TE.right(generateGangId())),
          TE.apS('rest', TE.right(rest)),
          TE.map(({ factionId, id, rest }) => ({ id, factionId, ...rest }))
        )
      )
    )
// type ValidateGang = (
//   checkFactionExists: CheckFactionExists
// ) => (
//   unvalidatedGang: UnvalidatedGang
// ) => E.Either<GangValidationError, ValidatedGang>

// type ValidateGangTE<NonDomainError = never> = (
//   unvalidatedGang: UnvalidatedGang
// ) => TE.TaskEither<GangValidationError | NonDomainError, ValidatedGang>

// type CreateEvents = (validatedGang: ValidatedGang) => FoundGangEvent[]

// export class FactionDoesNotExistError extends Error {
//   public _tag: 'FactionDoesNotExistError'

//   private constructor(factionId: string) {
//     super(`Faction: ${factionId} does not exist`)
//     this._tag = 'FactionDoesNotExistError'
//   }

//   public static of(factionId: string): FactionDoesNotExistError {
//     return new FactionDoesNotExistError(factionId)
//   }
// }

// export const toValidFactionId =
//   (checkFactionExists: CheckFactionExists) =>
//   (
//     factionId: string
//   ): E.Either<FactionDoesNotExistError | InvalidUUIDError, FactionId> => {
//     const checkFaction = (factionId: FactionId) => {
//       if (checkFactionExists(factionId)) {
//         return E.right(factionId)
//       }
//       return E.left(FactionDoesNotExistError.of(factionId))
//     }

//     return pipe(factionId, parseFactionId, E.chainW(checkFaction))
//   }

// export const toValidFactionIdTE =
//   <E = never>(checkFactionIdExists: CheckFactionIDExistsTE<E>) =>
//   (factionId: string) => {
//     const _checkFactionIdExists = (factionId: FactionId) =>
//       pipe(
//         factionId,
//         checkFactionIdExists,
//         TE.chainW((exists) =>
//           exists
//             ? TE.right(factionId)
//             : TE.left(FactionDoesNotExistError.of(factionId))
//         )
//       )

//     return pipe(
//       factionId,
//       parseFactionId,
//       TE.fromEither,
//       TE.chainW(_checkFactionIdExists)
//     )
//   }

// export const validateGang: ValidateGang =
//   (checkFactionExists) => (unvalidatedGang) => {
//     return pipe(unvalidatedGang, ({ name, factionId }) =>
//       sequenceS(E.Apply)({
//         id: E.right(createGangId()),
//         name: pipe(name, createString50('name')),
//         factionId: pipe(factionId, toValidFactionId(checkFactionExists)),
//       })
//     )
//   }

// export const createEvents: CreateEvents = (validatedGang) => {
//   return [
//     {
//       event: 'gangFounded',
//       details: validatedGang,
//     },
//   ]
// }

// export type GangValidationError =
//   | FactionDoesNotExistError
//   | InvalidUUIDError
//   | ConstrainedStringError
