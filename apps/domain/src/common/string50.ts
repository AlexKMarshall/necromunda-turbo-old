import { Opaque } from 'type-fest'
import { createString } from './constrained'

type URI = 'String50'

export type String50<T = URI> = Opaque<string, T>

export const create = <T = URI>(str: string) => createString<T>(50)(str)
