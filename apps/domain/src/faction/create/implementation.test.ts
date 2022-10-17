import { describe, test, expect } from 'vitest'
import * as TE from 'fp-ts/TaskEither'
import { validateFaction } from './implementation'
import { FactionDecodingError, FactionNameAlreadyExistsError } from './errors'

describe('validateFaction', () => {
  test('valid faction', async () => {
    const validInput = { name: 'Goliath' }
    const mockCheckFactionNameExists = () => TE.right(false)
    expect(
      await validateFaction(mockCheckFactionNameExists)(validInput)()
    ).toStrictEqualRight({ id: expect.any(String), name: validInput.name })
  })

  test('invalid faction format', async () => {
    const missingName = {} as any
    const mockCheckFactionNameExists = () => TE.right(false)
    expect(
      await validateFaction(mockCheckFactionNameExists)(missingName)()
    ).toStrictEqualLeft(expect.any(FactionDecodingError))
  })

  test('faction already exists', async () => {
    const faction = { name: 'Goliath' }
    const mockCheckFactionNameExists = () => TE.right(true)
    expect(
      await validateFaction(mockCheckFactionNameExists)(faction)()
    ).toStrictEqualLeft(expect.any(FactionNameAlreadyExistsError))
  })
})
