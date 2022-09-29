import { Opaque } from 'type-fest'
import * as UUID from './uuid'

type URI = 'FactionId'

export type FactionId = Opaque<string, URI>

type Create = (factionId: string) => FactionId

export const create: Create = (factionId) => {
  return UUID.create<URI>(factionId)
}
