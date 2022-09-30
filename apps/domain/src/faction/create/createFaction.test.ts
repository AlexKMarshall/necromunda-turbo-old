import { describe, it, expect } from 'vitest'
import { createFaction, UnvalidatedFaction } from './createFaction'

describe('createFaction', () => {
  it('should return a list of events', () => {
    const checkFactionExists = () => false
    const unvalidatedFaction: UnvalidatedFaction = {
      name: 'Van Saar',
    }

    expect(
      createFaction({ checkFactionExists })(unvalidatedFaction)
    ).toStrictEqualRight([
      {
        event: 'factionCreated',
        details: { id: expect.any(String), name: unvalidatedFaction.name },
      },
    ])
  })
})
