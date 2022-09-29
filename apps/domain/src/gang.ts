import * as E from 'fp-ts/Either'
import { z } from 'zod'

export type Gang = {
  id: GangId
  factionId: FactionId
  name: GangName
}

type FactionId = unknown
type GangId = unknown
const GangName = z.string().min(3).max(50)
type GangName = z.infer<typeof GangName>

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
