import * as N from '@necromunda/domain'
import { pipe } from 'fp-ts/lib/function'
import * as T from 'fp-ts/Task'
import { prisma } from './prisma'

const checkFactionNameExists = (name: string) => {
  return pipe(prisma.faction.findFirst({ where: { name } }), Boolean, T.of)
}

const domainCreateFaction = N.Faction.createFaction({ checkFactionNameExists })
