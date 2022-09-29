// Validation step

import { z } from 'zod'
import {
  GangId,
  GangName,
  UncheckedFactionId,
  validateFactionId,
} from '../types'
import {
  FoundGangEvent,
  UnvalidatedGang,
  ValidatedGang,
} from './foundGang.publicTypes'

type CheckFactionIdExists = (factionId: UncheckedFactionId) => true

// Validated Gang

type ValidateGang = (
  checkFactionIdExists: CheckFactionIdExists
) => (unvalidatedGang: UnvalidatedGang) => ValidatedGang

// Create events

type CreateEvents = (validatedGang: ValidatedGang) => FoundGangEvent[]

// Implementation

const validateGang: ValidateGang =
  (checkFactionIdExists) => (unvalidatedGang) => {
    const ValidGang = z.object({
      id: GangId,
      factionId: validateFactionId(checkFactionIdExists),
      name: GangName,
    })

    return ValidGang.parse(unvalidatedGang)
  }
