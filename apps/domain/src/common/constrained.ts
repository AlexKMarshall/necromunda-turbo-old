import { Opaque } from 'type-fest'
import * as E from 'fp-ts/Either'

export type ConstrainedString = Opaque<string, 'ConstrainedString'>

class EmptyStringError extends Error {
  public _tag: 'EmptyStringError'
  private constructor(fieldName: string) {
    super(`${fieldName} cannot be empty`)
    this._tag = 'EmptyStringError'
  }

  public static of(fieldName: string) {
    return new EmptyStringError(fieldName)
  }
}

class StringExceedsMaxLengthError extends Error {
  public _tag: 'StringExceedsMaxLengthError'
  private constructor(fieldName: string, maxLength: number) {
    super(`${fieldName} cannot be longer than ${maxLength}`)
    this._tag = 'StringExceedsMaxLengthError'
  }

  public static of(fieldName: string, maxLength: number) {
    return new StringExceedsMaxLengthError(fieldName, maxLength)
  }
}

export type ConstrainedStringError =
  | EmptyStringError
  | StringExceedsMaxLengthError

export const createString =
  <T>(fieldName: string) =>
  (maxLength: number) =>
  (str: string): E.Either<ConstrainedStringError, ConstrainedString> => {
    if (!str) {
      return E.left(EmptyStringError.of(fieldName))
    }
    if (str.length > maxLength) {
      return E.left(StringExceedsMaxLengthError.of(fieldName, maxLength))
    }
    return E.right(str as ConstrainedString)
  }
