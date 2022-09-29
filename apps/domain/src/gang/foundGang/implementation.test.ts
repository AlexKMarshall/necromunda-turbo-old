import { toValidFactionId, validateGang } from './implementation'
import { describe, it, expect } from 'vitest'
import * as UUID from './uuid'

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

describe('validateGang', () => {
  it('should return a valid gang if everything is correct', () => {
    const unvalidatedGang = {
      name: 'Test gang name',
      factionId: UUID.create(),
    }
    const checkFactionExists = () => true

    expect(validateGang(checkFactionExists)(unvalidatedGang)).toStrictEqual({
      name: unvalidatedGang.name,
      factionId: unvalidatedGang.factionId,
      id: expect.any(String),
    })
  })
})
