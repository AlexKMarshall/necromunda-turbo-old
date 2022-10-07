import * as IO from 'fp-ts/IO'
import * as T from 'fp-ts/Task'
import * as N from '@necromunda/domain'
import { flow, pipe } from 'fp-ts/lib/function'
import { prisma } from './prisma'
import * as TE from 'fp-ts/TaskEither'
import * as O from 'fp-ts/Option'
import { Context, Request } from 'koa'

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

type Response = {
  status: number
  message: string
}

const controllerCreateFactionPipeline = flow(
  domainCreateFaction,
  TE.fold(
    () => T.of({ status: 500, message: 'Oh no' }),
    () => T.of({ status: 200, message: 'Faction created' })
  )
)

type Controller = (ctx: Context) => T.Task<void>
export const createFactionController: Controller = (ctx) => {
  return pipe(
    ctx.request.body as any,
    controllerCreateFactionPipeline,
    T.map(({ status, message }) => {
      ctx.status = status
      ctx.body = { message }
    })
  )
}
