import { test, expect } from 'vitest'
import { min, max, between } from './string'

test('min length string', () => {
  expect(min(3).decode('123')).toBeRight()
  expect(min(3).decode('1234')).toBeRight()
  expect(min(3).decode('12')).toBeLeft()
})
test('max length string', () => {
  expect(max(5).decode('1234')).toBeRight()
  expect(max(5).decode('12345')).toBeRight()
  expect(max(5).decode('123456')).toBeLeft()
})
test('between string length', () => {
  expect(between(3, 5).decode('123')).toBeRight()
  expect(between(3, 5).decode('1234')).toBeRight()
  expect(between(3, 5).decode('12345')).toBeRight()
  expect(between(3, 5).decode('123456')).toBeLeft()
  expect(between(3, 5).decode('12')).toBeLeft()
})
