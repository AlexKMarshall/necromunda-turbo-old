import * as T from 'fp-ts/Task'
import { describe, it, expect } from 'vitest'
import { createFaction } from './createFaction'
import { UnvalidatedFaction } from './types'

describe('createFaction', () => {
  it('should return a list of events', async () => {
    const checkFactionNameExists = () => T.of(false)
    const unvalidatedFaction: UnvalidatedFaction = {
      name: 'Van Saar',
    }

    expect(
      await createFaction({ checkFactionNameExists })(unvalidatedFaction)()
    ).toStrictEqualRight([
      {
        event: 'factionCreated',
        details: { id: expect.any(String), name: unvalidatedFaction.name },
      },
    ])
  })
})
