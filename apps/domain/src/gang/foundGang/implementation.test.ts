import { describe, test, expect } from 'vitest'
import * as TE from 'fp-ts/TaskEither'
import { v4 as uuidV4 } from 'uuid'
import { validateGang } from './implementation'
import { FactionDoesNotExistError, GangDecodingError } from './errors'

describe('validateGang', () => {
  test('valid gang', async () => {
    const validInput = {
      name: 'My gang',
      factionId: uuidV4(),
    }
    const mockCheckFactionIdExists = () => TE.right(true)

    expect(
      await validateGang(mockCheckFactionIdExists)(validInput)()
    ).toStrictEqualRight({
      id: expect.any(String),
      factionId: validInput.factionId,
      name: validInput.name,
    })
  })

  test('invalid format', async () => {
    const missingName = {
      factionId: uuidV4(),
    } as any
    const mockCheckFactionIdExists = () => TE.right(true)

    expect(
      await validateGang(mockCheckFactionIdExists)(missingName)()
    ).toStrictEqualLeft(expect.any(GangDecodingError))
  })

  test('faction id does not exist', async () => {
    const validInput = {
      name: 'My gang',
      factionId: uuidV4(),
    }
    const mockCheckFactionIdExists = () => TE.right(false)

    expect(
      await validateGang(mockCheckFactionIdExists)(validInput)()
    ).toStrictEqualLeft(expect.any(FactionDoesNotExistError))
  })
})
