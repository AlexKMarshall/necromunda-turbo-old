// Inputs
import { FactionId, GangId, GangName } from '../types'

export type UnvalidatedGang = {
  factionId: string
  name: string
}

// Outputs (success)
export type ValidatedGang = {
  id: GangId
  factionId: FactionId
  name: GangName
}

export type GangFounded = { event: 'gangFounded'; details: ValidatedGang }

export type FoundGangEvent = GangFounded

// Outputs (error)

// The workflow
export type FoundGang = (unvalidatedGang: UnvalidatedGang) => FoundGangEvent[]
