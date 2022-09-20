import { z } from 'zod'

export const UUID = z.string().uuid()
