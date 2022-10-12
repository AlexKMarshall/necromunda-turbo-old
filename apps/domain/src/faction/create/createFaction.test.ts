import { describe, it, expect } from 'vitest'
import { createFaction } from './createFaction'
import { UnvalidatedFaction } from './types'
import * as TE from 'fp-ts/TaskEither'

describe.skip('createFaction', () => {
  it('should return a list of events', async () => {
    const checkFactionNameExists = () => TE.right(false)
    const unvalidatedFaction: UnvalidatedFaction = {
      name: 'Van Saar',
    }

    expect(
      await createFaction({ checkFactionNameExists })(unvalidatedFaction)()
    ).toStrictEqualRight({
      factionCreated: { id: expect.any(String), name: unvalidatedFaction.name },
      events: [
        {
          event: 'factionCreated',
          details: { id: expect.any(String), name: unvalidatedFaction.name },
        },
      ],
    })
  })
})
