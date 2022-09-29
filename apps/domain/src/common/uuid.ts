import { v4 as uuidv4 } from 'uuid'
import { Opaque } from 'type-fest'
import { z } from 'zod'

type URI = 'UUID'

export type UUID<T = URI> = Opaque<string, T>

export const create = <T = URI>(uuid: string = uuidv4()) => {
  return z.string().uuid().parse(uuid) as UUID<T>
}
