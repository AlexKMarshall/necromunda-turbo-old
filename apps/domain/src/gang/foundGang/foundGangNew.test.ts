import { foundGang, toValidFactionId, validateGang } from './foundGangNew'
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

describe('foundGang', () => {
  it('should return a list of events', () => {
    const checkFactionExists = () => true
    const unvalidatedGang = {
      name: 'Test gang name',
      factionId: UUID.create(),
    }

    expect(foundGang({ checkFactionExists })(unvalidatedGang)).toStrictEqual([
      {
        event: 'gangFounded',
        details: {
          name: unvalidatedGang.name,
          factionId: unvalidatedGang.factionId,
          id: expect.any(String),
        },
      },
    ])
  })
})
