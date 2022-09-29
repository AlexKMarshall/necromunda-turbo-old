// Validation step

import { FactionId } from '../types'
import {
  FoundGangEvent,
  UnvalidatedGang,
  ValidatedGang,
} from './foundGang.publicTypes'

type CheckFactionIdExists = (factionId: FactionId) => true

// Validated Gang

type ValidateGang = (
  checkFactionIdExists: CheckFactionIdExists
) => (unvalidedGang: UnvalidatedGang) => ValidatedGang

// Create events

type CreateEvents = (validatedGang: ValidatedGang) => FoundGangEvent[]
