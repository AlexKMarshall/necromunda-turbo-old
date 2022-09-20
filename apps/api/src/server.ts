import Koa from 'koa'
import Router from '@koa/router'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import morgan from 'koa-morgan'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { UUID } from 'validation'
const prisma = new PrismaClient()

const Faction = z.object({
  id: UUID,
  name: z.string().min(1),
  description: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

const FactionCompact = Faction.omit({ description: true })

export const createServer = () => {
  const app = new Koa()
  const router = new Router()

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

  app
    .use(morgan('dev'))
    .use(bodyParser())
    .use(cors())
    .use(router.routes())
    .use(router.allowedMethods())

  return app
}
