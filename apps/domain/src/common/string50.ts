import { Opaque, UnwrapOpaque } from 'type-fest'
import { ConstrainedString, createString } from './constrained'
import { pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'

type URI = 'String50'

export type String50 = Opaque<string, URI>

const _tag = (value: ConstrainedString): String50 => {
  const _value: UnwrapOpaque<ConstrainedString> = value
  return _value as String50
}

export const create = (fieldName: string) => (str: string) => {
  return pipe(str, createString(fieldName)(50), E.map(_tag))
}
