import * as TE from 'fp-ts/TaskEither'
import {
  FactionDoesNotExistError,
  toValidFactionId,
  toValidFactionIdTE,
  validateGang,
} from './implementation'
import { describe, it, expect } from 'vitest'
import * as UUID from '../../common/uuid'
import { pipe } from 'fp-ts/function'
import { v4 as uuid } from 'uuid'

describe('toValidFactionId', () => {
  it('should return id if it is found', () => {
    const factionId = uuid()
    const checkFactionExists = () => true

    expect(toValidFactionId(checkFactionExists)(factionId)).toStrictEqualRight(
      factionId
    )
  })
  it('should return error if id is not found', () => {
    const factionId = uuid()
    const checkFactionExists = () => false

    expect(toValidFactionId(checkFactionExists)(factionId)).toEqualLeft(
      expect.any(FactionDoesNotExistError)
    )
  })
  it('should return error if id is not a UUID', () => {
    const factionId = 'abc'
    const checkFactionExists = () => false

    expect(toValidFactionId(checkFactionExists)(factionId)).toEqualLeft(
      expect.any(UUID.InvalidUUIDError)
    )
  })
})

describe('toValidFactionIdTE', () => {
  it('should return id if it is found', async () => {
    const factionId = uuid()
    const checkFactionExists = () => TE.right(true)

    expect(
      await toValidFactionIdTE(checkFactionExists)(factionId)()
    ).toStrictEqualRight(factionId)
  })
  it('should return error if id is not found', async () => {
    const factionId = uuid()
    const checkFactionExists = () => TE.right(false)

    expect(
      await toValidFactionIdTE(checkFactionExists)(factionId)()
    ).toEqualLeft(expect.any(FactionDoesNotExistError))
  })
  it('should return error if id is not a UUID', async () => {
    const factionId = 'abc'
    const checkFactionExists = () => TE.right(false)

    expect(
      await toValidFactionIdTE(checkFactionExists)(factionId)()
    ).toEqualLeft(expect.any(UUID.InvalidUUIDError))
  })
})

describe('validateGang', () => {
  it('should return a valid gang if everything is correct', () => {
    const unvalidatedGang = {
      name: 'Test gang name',
      factionId: uuid(),
    }
    const checkFactionExists = () => true

    expect(
      pipe(unvalidatedGang, validateGang(checkFactionExists))
    ).toStrictEqualRight({
      name: unvalidatedGang.name,
      factionId: unvalidatedGang.factionId,
      id: expect.any(String),
    })
  })
})
