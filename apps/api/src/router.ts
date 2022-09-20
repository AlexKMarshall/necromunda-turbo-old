import { Router } from 'express'

const router = Router()

router.get('/factions', (req, res) => {
  res.send({ items: [], meta: { pagination: { totalCount: 0 } } })
})
