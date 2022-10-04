import { Opaque } from 'type-fest'

export const createString =
  <T>(fieldName: string) =>
  (maxLength: number) =>
  (str: string): Opaque<string, T> => {
    if (!str) {
      throw new Error(`${fieldName} cannot be empty`)
    }
    if (str.length > maxLength) {
      throw new Error(
        `${fieldName} cannot be more than ${maxLength} characters`
      )
    }
    return str as Opaque<string, T>
  }
