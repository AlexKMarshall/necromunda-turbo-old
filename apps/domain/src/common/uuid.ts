import { v4 as UUIDv4 } from 'uuid'
import { pipe } from 'fp-ts/lib/function'
import * as D from 'io-ts/Decoder'
import { validate as uuidValidate } from 'uuid'

export type UUIDBrand = {
  readonly UUID: unique symbol
}

export type UUID = string & UUIDBrand

export const UUID: D.Decoder<unknown, UUID> = pipe(
  D.string,
  D.refine((s): s is UUID => uuidValidate(s), 'UUID invalid')
)

export const generate = () => UUIDv4() as UUID
