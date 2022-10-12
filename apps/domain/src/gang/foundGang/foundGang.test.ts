import { foundGang } from './foundGang'
import { describe, it, expect } from 'vitest'
import * as UUID from '../../common/uuid-old'
import { v4 as uuid } from 'uuid'

describe('foundGang', () => {
  it('should return a list of events', () => {
    const checkFactionExists = () => true
    const unvalidatedGang = {
      name: 'Test gang name',
      factionId: uuid(),
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
