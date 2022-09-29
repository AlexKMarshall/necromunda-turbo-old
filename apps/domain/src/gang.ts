import * as E from 'fp-ts/Either'

export type Gang = {
  id: GangId
  factionId: FactionId
  name: GangName
}

type FactionId = unknown
type GangId = unknown
type GangName = unknown

type UnvalidatedGang = {
  factionId: string
  name: string
}

type FoundGangEvents = {
  gangAcknowledgementSent: GangAcknowledgementSent
  foundedGang: FoundedGang
}

type GangAcknowledgementSent = unknown
type FoundedGang = unknown

type FoundGangError = ValidationError[]

type ValidationError = {
  fieldName: string
  errorDescription: string
}

type FoundGang = (
  unvalidatedGang: UnvalidatedGang
) => E.Either<FoundGangError, FoundGangEvents>
