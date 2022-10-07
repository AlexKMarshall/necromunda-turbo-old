import { describe, it, expect } from 'vitest'
import { toValidFactionNameTE, validateFactionTE } from './implementation'
import { UnvalidatedFaction } from './types'
import * as TE from 'fp-ts/TaskEither'

describe('toValidFactionName', () => {
  it('should pass a name that does not exist already', async () => {
    const checkFactionExists = () => TE.right(false)
    const factionName = 'Goliath'
    const actual = await toValidFactionNameTE(checkFactionExists)(factionName)()
    expect(actual).toStrictEqualRight(factionName)
  })
  it('should reject pre-existing faction', async () => {
    const checkFactionExists = () => TE.right(true)
    const factionName = 'Escher'
    expect(
      await toValidFactionNameTE(checkFactionExists)(factionName)()
    ).toBeLeft()
  })
})

describe('validateFaction', () => {
  it('should pass a valid faction', async () => {
    const unvalidatedFaction: UnvalidatedFaction = {
      name: 'Orlock',
    }
    const checkFactionExists = () => TE.right(false)
    expect(
      await validateFactionTE(checkFactionExists)(unvalidatedFaction)()
    ).toStrictEqualRight({
      id: expect.any(String),
      name: unvalidatedFaction.name,
    })
  })
})
