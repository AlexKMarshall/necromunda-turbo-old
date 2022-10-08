import * as T from 'fp-ts/Task'
import * as N from '@necromunda/domain'
import { flow, pipe } from 'fp-ts/lib/function'
import { prisma } from './prisma'
import * as TE from 'fp-ts/TaskEither'
import * as O from 'fp-ts/Option'
import { Context } from 'koa'

// repository infrastructure
const checkFactionNameExistsNew = (name: string) =>
  pipe(
    prisma.faction.findFirst({ where: { name } }),
    (promise) =>
      TE.tryCatch(
        () => promise,
        () => new DBError()
      ),
    TE.map(
      flow(
        O.fromNullable,
        O.fold(
          () => false,
          () => true
        )
      )
    )
  )
class DBError extends Error {}

// connect persistance to create domain service with all dependencies attached
const domainCreateFaction = N.Faction.createFaction({
  checkFactionNameExists: checkFactionNameExistsNew,
})

const saveFaction = flow(
  TE.tryCatchK(
    async (faction: N.Faction.ValidatedFaction) => {
      await prisma.faction.create({ data: faction })
    },
    () => new DBError()
  )
)

const domainCreateFactionWithPersistance = flow(
  domainCreateFaction,
  TE.chainFirst(({ factionCreated }) => saveFaction(factionCreated))
)

const controllerCreateFactionPipeline = flow(
  domainCreateFactionWithPersistance,
  TE.foldW(
    () => T.of({ status: 400, body: { message: 'oh no' } }),
    ({ factionCreated }) => T.of({ status: 200, body: factionCreated })
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
