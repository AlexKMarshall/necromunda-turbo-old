import { Opaque } from 'type-fest'
import * as UUID from './uuid'

type URI = 'GangId'

export type GangId = Opaque<string, URI>

type Create = (gangId?: string) => GangId

export const create: Create = (gangId): GangId => {
  return UUID.create<URI>(gangId)
}
