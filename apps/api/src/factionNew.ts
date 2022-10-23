import * as T from 'fp-ts/Task'
import * as N from '@necromunda/domain'
import { flow, pipe } from 'fp-ts/lib/function'
import { prisma } from './prisma'
import * as TE from 'fp-ts/TaskEither'
import { Context } from 'koa'
import { safeDBAccess } from './infrastructure/db-utils'

const findFactionByName = safeDBAccess((name: string) =>
  prisma.faction.findUnique({ where: { name } })
)

const findFactionById = safeDBAccess((id: string) =>
  prisma.faction.findUnique({ where: { id } })
)

const persistFaction = safeDBAccess((faction: N.Faction.ValidatedFaction) =>
  prisma.faction.create({ data: faction })
)

const checkFactionNameExists = flow(findFactionByName, TE.map(Boolean))

export const checkFactionIdExists = flow(findFactionById, TE.map(Boolean))

const controllerCreateFactionPipeline = flow(
  N.Faction.createFaction({ checkFactionNameExists }),
  TE.map(({ factionCreated }) => factionCreated),
  TE.chainFirstW(persistFaction),
  TE.foldW(
    (error) => {
      console.error(error)
      return T.of({ status: 400, body: { message: 'oh no' } })
    },
    (factionCreated) => T.of({ status: 200, body: factionCreated })
  )
)

type Controller = (ctx: Context) => T.Task<void>
export const createFactionController: Controller = (ctx) => {
  return pipe(
    ctx.request.body as any,
    controllerCreateFactionPipeline,
    T.map(({ status, body }) => {
      ctx.status = status
      ctx.body = body
    })
  )
}
