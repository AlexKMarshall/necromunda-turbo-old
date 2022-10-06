import * as FactionName from './name'
import { describe, it, expect } from 'vitest'

describe('parse faction name', () => {
  const parseFactionName = FactionName.parse('fieldName')
  it('should accept a string', () => {
    const factionName = 'abc123'
    expect(parseFactionName(factionName)).toStrictEqualRight(factionName)
  })
  it('should prevent empty', () => {
    expect(parseFactionName('')).toBeLeft()
  })
  it('should names longer than 50 chars', () => {
    const tooLongName = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxy'
    expect(parseFactionName(tooLongName)).toBeLeft()
  })
})
