import { Opaque } from 'type-fest'

export const createString =
  <T>(maxLength: number) =>
  (str: string): Opaque<string, T> => {
    if (!str) {
      throw new Error('Cannot be empty')
    }
    if (str.length > maxLength) {
      throw new Error(`Cannot be more than ${maxLength} characters`)
    }
    return str as Opaque<string, T>
  }
