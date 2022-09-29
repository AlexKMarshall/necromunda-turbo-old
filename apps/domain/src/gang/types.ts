import { Opaque } from 'type-fest'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'

export const generateUuid = () => UUID.parse(uuidv4())

export const UUID = z.string().uuid().brand()
export type UUID = z.infer<typeof UUID>

export const GangId = UUID.default(generateUuid).brand()
export type GangId = z.infer<typeof GangId>

export const UncheckedFactionId = z.string().uuid().brand()
export type UncheckedFactionId = z.infer<typeof UncheckedFactionId>

type CheckFactionIdExists = (uncheckedFactionId: UncheckedFactionId) => true
export const validateFactionId = (checkFactionIdExists: CheckFactionIdExists) =>
  UncheckedFactionId.refine(checkFactionIdExists).brand()
export type CheckedFactionId = z.infer<ReturnType<typeof validateFactionId>>
export const GangName = z.string().brand()
export type GangName = z.infer<typeof GangName>
