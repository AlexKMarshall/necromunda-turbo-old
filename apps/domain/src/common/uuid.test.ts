import { test, expect } from 'vitest'
import { v4 } from 'uuid'
import { UUID, generate } from './uuid'

test('decoding valid UUID', () => {
  expect(UUID.decode(v4())).toBeRight()
})
test('decoding invalid uuid', () => {
  expect(UUID.decode('abc')).toBeLeft()
})
test('generating UUID', () => {
  expect(UUID.decode(generate())).toBeRight()
})
