import { Context } from 'koa'
import {
  createFaction,
  CreateFactionDTO,
  getFactionCount,
  getFactions,
} from 'src/faction'

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

export const postFaction = async (ctx: Context) => {
  const createFactionDTO = CreateFactionDTO.parse(ctx.request.body)
  const savedFaction = await createFaction(createFactionDTO)
  ctx.body = savedFaction
}
