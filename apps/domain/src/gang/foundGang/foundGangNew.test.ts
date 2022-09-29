import { toValidFactionId } from './foundGangNew'
import { describe, it, expect } from 'vitest'
import * as UUID from './uuid'
import { boolean } from 'zod'

describe('toValidFactionId', () => {
  it('should return id if it is found', () => {
    const factionId = UUID.create()
    const checkFactionExists = () => true

    expect(toValidFactionId(checkFactionExists)(factionId)).toBe(factionId)
  })
  it('should throw if id is not found', () => {
    const factionId = UUID.create()
    const checkFactionExists = () => false

    expect(() =>
      toValidFactionId(checkFactionExists)(factionId)
    ).toThrowErrorMatchingInlineSnapshot(`"Invalid factionId: ${factionId}"`)
  })
  it('should throw if id is not a UUID', () => {
    const factionId = 'abc'
    const checkFactionExists = () => false

    expect(() => toValidFactionId(checkFactionExists)(factionId)).toThrowError()
  })
})
