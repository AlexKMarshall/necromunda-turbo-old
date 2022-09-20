import Router from '@koa/router'
import {
  createFaction,
  CreateFactionDTO,
  getFactionCount,
  getFactions,
} from './faction'

export const router = new Router()

router.get('/', (ctx) => {
  ctx.body = 'Hello world'
})
router.get('/factions', async (ctx) => {
  const [factions, totalCount] = await Promise.all([
    getFactions,
    getFactionCount,
  ])
  ctx.body = {
    items: factions,
    meta: { pagination: { totalCount } },
  }
})
router.post('/factions', async (ctx) => {
  const createFactionDTO = CreateFactionDTO.parse(ctx.request.body)
  const savedFaction = await createFaction(createFactionDTO)
  ctx.body = savedFaction
})
router.get('/healthz', (ctx) => (ctx.body = { ok: true }))
