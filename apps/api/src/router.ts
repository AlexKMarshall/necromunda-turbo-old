import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export const router: Router = Router()

router.get('/factions', async (req, res) => {
  try {
    const factions = await prisma.faction.findMany()
    const totalCount = await prisma.faction.count()
    res.status(200)
    res.send({ items: factions, meta: { pagination: { totalCount } } })
  } catch (error) {
    throw error
  }
})

router.post('/factions', async (req, res) => {
  try {
    const savedFaction = await prisma.faction.create({ data: req.body })
    res.status(201)
    res.send(savedFaction)
  } catch (error) {
    throw error
  }
})
