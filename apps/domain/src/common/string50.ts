import { Opaque } from 'type-fest'
import { createString } from './constrained'
import { pipe } from 'fp-ts/function'

type URI = 'String50'

export type String50<T = URI> = Opaque<string, T>

export const create =
  <T = URI>(fieldName: string) =>
  (str: string): String50<T> => {
    return pipe(str, createString<T>(fieldName)(50))
  }
