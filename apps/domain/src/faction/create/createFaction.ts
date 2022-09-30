import { Opaque } from 'type-fest'
import { FactionId } from './factionId'
import { UniqueFactionName } from './implementation'

export type UnvalidatedFaction = {
  name: string
}

export type FactionName = Opaque<string, 'FactionName'>

export type ValidatedFaction = {
  name: UniqueFactionName
  id: FactionId
}

export type FactionCreated = {
  event: 'factionCreated'
  details: ValidatedFaction
}

export type CreateFactionEvent = FactionCreated

export type CreateFaction = (
  unvalidatedFaction: UnvalidatedFaction
) => CreateFactionEvent[]
