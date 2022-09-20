import { Router } from 'express'
export const router: Router = Router()

router.get('/factions', (req, res) => {
  res.send({ items: [], meta: { pagination: { totalCount: 0 } } })
})
