import { describe, it, expect } from 'vitest'
import { UnvalidatedFaction } from './createFaction'
import { toValidFactionName, validateFaction } from './implementation'

describe('toValidFactionName', () => {
  it('should pass a name that does not exist already', () => {
    const checkFactionExists = () => false
    const factionName = 'Goliath'
    expect(
      toValidFactionName(checkFactionExists)(factionName)
    ).toStrictEqualRight(factionName)
  })
  it('should reject pre-existing faction', () => {
    const checkFactionExists = () => true
    const factionName = 'Escher'
    expect(toValidFactionName(checkFactionExists)(factionName)).toBeLeft()
  })
})

describe('validateFaction', () => {
  it('should pass a valid faction', () => {
    const unvalidatedFaction: UnvalidatedFaction = {
      name: 'Orlock',
    }
    const checkFactionExists = () => false
    expect(
      validateFaction(checkFactionExists)(unvalidatedFaction)
    ).toStrictEqualRight({
      id: expect.any(String),
      name: unvalidatedFaction.name,
    })
  })
})
