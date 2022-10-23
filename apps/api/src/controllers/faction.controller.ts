import { Context } from 'koa'
import { getFactionCount, getFactions } from '../faction'

export const getFactionCollection = async (ctx: Context) => {
  const [factions, totalCount] = await Promise.all([
    getFactions,
    getFactionCount,
  ])
  ctx.body = {
    items: factions,
    meta: { pagination: { totalCount } },
  }
}
