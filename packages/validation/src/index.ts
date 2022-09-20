import { z } from 'zod'

export const UUID = z.string().uuid()
export const JSONDate = z.preprocess(
  (value) =>
    typeof value === 'string' || typeof value === 'number'
      ? new Date(value)
      : value,
  z.date()
)
