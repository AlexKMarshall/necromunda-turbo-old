import * as N from '@necromunda/domain'
import { flow, pipe } from 'fp-ts/lib/function'
import * as T from 'fp-ts/Task'
import { prisma } from './prisma'
import * as TE from 'fp-ts/TaskEither'
import * as O from 'fp-ts/Option'

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

const domainCreateFactionTE = N.Faction.createFaction({
  checkFactionNameExists: checkFactionNameExistsNew,
})
