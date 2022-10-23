import { describe, test, expect } from 'vitest'
import * as TE from 'fp-ts/TaskEither'
import { validateFighterType } from './implementation'
import { v4 as uuidv4 } from 'uuid'
import {
  FactionDoesNotExistError,
  FighterTypeDecodingError,
  FighterTypeNameAlreadyExistsError,
} from './errors'

describe('validateFighterType', () => {
  test('valid fighter type', async () => {
    const validInput = {
      name: 'Death Maiden',
      cost: 80,
      factionId: uuidv4(),
      category: 'specialist',
    }
    const checkFactionIdExists = () => TE.right(true)
    const checkFighterTypeNameExists = () => TE.right(false)
    expect(
      await validateFighterType({
        checkFactionIdExists,
        checkFighterTypeNameExists,
      })(validInput)()
    ).toStrictEqualRight({
      id: expect.any(String),
      name: validInput.name,
      cost: validInput.cost,
      factionId: validInput.factionId,
      category: validInput.category,
    })
  })

  test('invalid fighter type format', async () => {
    const missingFields = {} as any
    const checkFactionIdExists = () => TE.right(true)
    const checkFighterTypeNameExists = () => TE.right(false)

    expect(
      await validateFighterType({
        checkFactionIdExists,
        checkFighterTypeNameExists,
      })(missingFields)()
    ).toStrictEqualLeft(expect.any(FighterTypeDecodingError))
  })

  test('fighter type already exists', async () => {
    const faction = {
      name: 'Death Maiden',
      cost: 80,
      factionId: uuidv4(),
      category: 'specialist',
    }
    const checkFighterTypeNameExists = () => TE.right(true)
    const checkFactionIdExists = () => TE.right(true)
    expect(
      await validateFighterType({
        checkFactionIdExists,
        checkFighterTypeNameExists,
      })(faction)()
    ).toStrictEqualLeft(expect.any(FighterTypeNameAlreadyExistsError))
  })
  test('faction id does not exist', async () => {
    const faction = {
      name: 'Death Maiden',
      cost: 80,
      factionId: uuidv4(),
      category: 'specialist',
    }
    const checkFighterTypeNameExists = () => TE.right(false)
    const checkFactionIdExists = () => TE.right(false)
    expect(
      await validateFighterType({
        checkFactionIdExists,
        checkFighterTypeNameExists,
      })(faction)()
    ).toStrictEqualLeft(expect.any(FactionDoesNotExistError))
  })
})
