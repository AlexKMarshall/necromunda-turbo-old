import * as T from 'fp-ts/Task'
import * as N from '@necromunda/domain'
import { flow, pipe } from 'fp-ts/lib/function'
import { prisma } from './prisma'
import * as TE from 'fp-ts/TaskEither'
import { Context } from 'koa'
import { ValidatedFaction } from '@necromunda/domain/dist/faction'
import { DBError } from './infrastructure/errors'

type DBFunction<A extends readonly unknown[], B> = (...a: A) => Promise<B>

const safeDBAccess = <A extends readonly unknown[], B>(f: DBFunction<A, B>) =>
  TE.tryCatchK(f, DBError.of)

// Raw queries
const findFactionByName = (name: string) =>
  prisma.faction.findUnique({ where: { name } })

const findFactionById = (id: string) =>
  prisma.faction.findUnique({ where: { id } })

const persistFaction = safeDBAccess((faction: ValidatedFaction) =>
  prisma.faction.create({ data: faction })
)

const checkFactionNameExists = flow(
  safeDBAccess(findFactionByName),
  TE.map(Boolean)
)

export const checkFactionIdExists = flow(
  safeDBAccess(findFactionById),
  TE.map(Boolean)
)

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
