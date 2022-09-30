import { v4 as uuidv4 } from 'uuid'
import { Opaque } from 'type-fest'
import { z } from 'zod'
import * as E from 'fp-ts/Either'

type URI = 'UUID'

export class InvalidUUIDError extends Error {
  public _tag: 'InvalidUUIDError'
  private constructor(value: string) {
    super(`${value} is not a valid UUID`)
    this._tag = 'InvalidUUIDError'
  }

  public static of(value: string) {
    return new InvalidUUIDError(value)
  }
}

export type UUID<T = URI> = Opaque<string, T>

export const parse = (uuid: string = uuidv4()) => {
  const result = z.string().uuid().safeParse(uuid)

  return result.success
    ? E.right(result.data)
    : E.left(InvalidUUIDError.of(uuid))
}

// export const create = () => {
//   return uuidv4() as UUID
// }
