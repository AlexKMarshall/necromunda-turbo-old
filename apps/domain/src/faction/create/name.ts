import { flow, pipe } from 'fp-ts/lib/function'
import { Opaque, UnwrapOpaque } from 'type-fest'
import * as String50 from '../../common/deprecated/string50-old'
import * as E from 'fp-ts/Either'

export type FactionName = Opaque<string, 'FactionName'>

const _tag = (name: String50.String50): FactionName =>
  String50.value(name) as FactionName

export const parse = (fieldName: string) => (name: string) =>
  pipe(name, String50.create(fieldName), E.map(_tag))

export const value = (name: FactionName): UnwrapOpaque<FactionName> => name
