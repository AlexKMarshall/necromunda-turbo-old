import { describe, it, expect } from 'vitest'
import {
  toValidFactionName,
  toValidFactionNameT,
  validateFaction,
} from './implementation'
import { UnvalidatedFaction } from './types'
import * as T from 'fp-ts/Task'

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

describe('toValidFactionNameT', () => {
  it('should pass a name that does not exist already', async () => {
    const checkFactionExists = () => T.of(false)
    const factionName = 'Goliath'
    const actual = await toValidFactionNameT(checkFactionExists)(factionName)()
    expect(actual).toStrictEqualRight(factionName)
  })
  it('should reject pre-existing faction', async () => {
    const checkFactionExists = () => T.of(true)
    const factionName = 'Escher'
    expect(
      await toValidFactionNameT(checkFactionExists)(factionName)()
    ).toBeLeft()
  })
})

describe('validateFaction', () => {
  it('should pass a valid faction', async () => {
    const unvalidatedFaction: UnvalidatedFaction = {
      name: 'Orlock',
    }
    const checkFactionExists = () => T.of(false)
    expect(
      await validateFaction(checkFactionExists)(unvalidatedFaction)()
    ).toStrictEqualRight({
      id: expect.any(String),
      name: unvalidatedFaction.name,
    })
  })
})
