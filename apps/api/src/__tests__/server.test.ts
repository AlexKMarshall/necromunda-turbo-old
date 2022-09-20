import supertest from 'supertest'
import { createServer } from '../server'

describe('server', () => {
  it.only('health check returns 200', async () => {
    const response = await supertest(createServer().callback()).get('/healthz')

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual({ ok: true })
  })
})
