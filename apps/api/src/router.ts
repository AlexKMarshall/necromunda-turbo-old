import Router from '@koa/router'
import { getFactionCollection } from './controllers/faction.controller'
import { createFactionController } from './factionNew'

export const router = new Router()

router.get('/', (ctx) => {
  ctx.body = 'Hello world'
})
router.get('/factions', getFactionCollection)
router.post('/factions', async (ctx) => {
  const program = createFactionController(ctx)
  await program()
})
router.get('/healthz', (ctx) => (ctx.body = { ok: true }))
