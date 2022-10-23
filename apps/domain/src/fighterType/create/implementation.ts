import { flow, pipe } from 'fp-ts/lib/function'
import * as D from 'io-ts/Decoder'
import { Credits } from 'src/common/credits'
import { FactionId } from 'src/faction'
import * as S from '../../common/string'
import { FighterCategory } from './FighterCategory'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import {
  FactionDoesNotExistError,
  FighterTypeDecodingError,
  FighterTypeNameAlreadyExistsError,
} from './errors'
import * as FighterTypeId from './fighterTypeId'

export type UnvalidatedFighterType = {
  name: string
  factionId: string
  category: string
}

const FighterTypeDecoder = D.struct({
  name: pipe(D.string, D.compose(S.between(2, 50))),
  factionId: FactionId,
  category: FighterCategory,
  cost: Credits,
})
type FighterTypeDecoded = D.TypeOf<typeof FighterTypeDecoder>

type FighterTypeName = FighterTypeDecoded['name']

type CheckFactionIdExists<NonDomainError> = (
  factionId: FactionId
) => TE.TaskEither<NonDomainError, boolean>
type CheckFighterTypeNameExists<NonDomainError> = (
  name: FighterTypeName
) => TE.TaskEither<NonDomainError, boolean>

type ExistingFactionIdBrand = {
  readonly ExistingFactionId: unique symbol
}

type ExistingFactionId = FactionId & ExistingFactionIdBrand

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

type UniqueFighterTypeBrand = {
  readonly UniqueFactionName: unique symbol
}

export type UniqueFighterTypeName = FighterTypeName & UniqueFighterTypeBrand

const _tagUniqueFighterTypeName = (
  name: FighterTypeName
): UniqueFighterTypeName => name as UniqueFighterTypeName

const toUniqueFighterTypeName =
  <E>(checkFighterTypeNameExists: CheckFighterTypeNameExists<E>) =>
  (name: FighterTypeName) => {
    return pipe(
      name,
      TE.right,
      TE.chainFirst(
        flow(
          checkFighterTypeNameExists,
          TE.filterOrElseW(
            (exists) => exists === false,
            () => FighterTypeNameAlreadyExistsError.of(name)
          )
        )
      ),
      TE.map(_tagUniqueFighterTypeName)
    )
  }

export type ValidatedFighterType = FighterTypeDecoded & {
  name: UniqueFighterTypeName
  factionId: ExistingFactionId
  id: FighterTypeId.FighterTypeId
}

export type ValidateFighterTypeDependencies<E1, E2> = {
  checkFactionIdExists: CheckFactionIdExists<E1>
  checkFighterTypeNameExists: CheckFighterTypeNameExists<E2>
}

export const validateFighterType =
  <E1, E2>({
    checkFactionIdExists,
    checkFighterTypeNameExists,
  }: ValidateFighterTypeDependencies<E1, E2>) =>
  (fighterType: UnvalidatedFighterType) =>
    pipe(
      fighterType,
      FighterTypeDecoder.decode,
      E.mapLeft(FighterTypeDecodingError.of),
      TE.fromEither,
      TE.chainW(({ name, factionId, ...rest }) =>
        pipe(
          TE.Do,
          TE.apSW(
            'name',
            toUniqueFighterTypeName(checkFighterTypeNameExists)(name)
          ),
          TE.apSW(
            'factionId',
            toExistingFactionId(checkFactionIdExists)(factionId)
          ),
          TE.apS('id', TE.right(FighterTypeId.generate())),
          TE.apS('rest', TE.right(rest)),
          TE.map(({ name, factionId, id, rest }) => ({
            name,
            factionId,
            id,
            ...rest,
          }))
        )
      )
    )

export type FighterTypeValidationError =
  | FighterTypeDecodingError
  | FighterTypeNameAlreadyExistsError
  | FactionDoesNotExistError
