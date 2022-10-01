import Router from '@koa/router'
import {
  getFactionCollection,
  postFaction,
} from './controllers/faction.controller'

export const router = new Router()

router.get('/', (ctx) => {
  ctx.body = 'Hello world'
})
router.get('/factions', getFactionCollection)
router.post('/factions', postFaction)
router.get('/healthz', (ctx) => (ctx.body = { ok: true }))
