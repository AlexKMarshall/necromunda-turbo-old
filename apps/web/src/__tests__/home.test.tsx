import { expect, test } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import Home from '../pages'

test('home', () => {
  render(<Home />)
  expect(
    screen.getByRole('heading', { level: 1, name: /store/i })
  ).toBeDefined()
})
