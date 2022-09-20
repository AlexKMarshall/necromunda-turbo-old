import Router from '@koa/router'
import { PrismaClient } from '@prisma/client'
import { UUID, JSONDate } from 'validation'
import { z } from 'zod'

const prisma = new PrismaClient()

const Faction = z.object({
  id: UUID,
  name: z.string().min(1),
  description: z.string().nullish(),
  createdAt: JSONDate,
  updatedAt: JSONDate,
})

const FactionCompact = Faction.omit({ description: true })

export const router = new Router()

router.get('/', (ctx) => {
  ctx.body = 'Hello world'
})
router.get('/factions', async (ctx) => {
  const factions = await prisma.faction.findMany()
  const totalCount = await prisma.faction.count()
  ctx.body = {
    items: factions.map((faction) => FactionCompact.parse(faction)),
    meta: { pagination: { totalCount } },
  }
})
router.post('/factions', async (ctx) => {
  const savedFaction = await prisma.faction.create({
    data: ctx.request.body as any,
  })
  ctx.body = savedFaction
})
router.get('/healthz', (ctx) => (ctx.body = { ok: true }))
