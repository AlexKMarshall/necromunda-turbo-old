import * as T from 'fp-ts/Task'
import { describe, it, expect } from 'vitest'
import { createFaction, createFactionT } from './createFaction'
import { UnvalidatedFaction } from './types'

describe('createFaction', () => {
  it('should return a list of events', () => {
    const checkFactionNameExists = () => false
    const unvalidatedFaction: UnvalidatedFaction = {
      name: 'Van Saar',
    }

    expect(
      createFaction({ checkFactionNameExists })(unvalidatedFaction)
    ).toStrictEqualRight([
      {
        event: 'factionCreated',
        details: { id: expect.any(String), name: unvalidatedFaction.name },
      },
    ])
  })
})

describe('createFactionT', () => {
  it('should return a list of events', async () => {
    const checkFactionNameExists = () => T.of(false)
    const unvalidatedFaction: UnvalidatedFaction = {
      name: 'Van Saar',
    }

    expect(
      await createFactionT({ checkFactionNameExists })(unvalidatedFaction)()
    ).toStrictEqualRight([
      {
        event: 'factionCreated',
        details: { id: expect.any(String), name: unvalidatedFaction.name },
      },
    ])
  })
})
