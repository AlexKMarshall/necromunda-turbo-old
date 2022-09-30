import { foundGang } from './foundGang'
import { describe, it, expect } from 'vitest'
import * as UUID from '../../common/uuid'

describe('foundGang', () => {
  it('should return a list of events', () => {
    const checkFactionExists = () => true
    const unvalidatedGang = {
      name: 'Test gang name',
      factionId: UUID.create(),
    }

    expect(
      foundGang({ checkFactionExists })(unvalidatedGang)
    ).toStrictEqualRight([
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
