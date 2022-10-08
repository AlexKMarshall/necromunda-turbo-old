import * as TE from 'fp-ts/TaskEither'
import { DBError } from './errors'

type DBFunction<A extends readonly unknown[], B> = (...a: A) => Promise<B>

export const safeDBAccess = <A extends readonly unknown[], B>(
  f: DBFunction<A, B>
) => TE.tryCatchK(f, DBError.of)
