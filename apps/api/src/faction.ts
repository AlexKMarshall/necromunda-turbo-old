import { UUID, JSONDate } from 'validation'
import { z } from 'zod'
import { ResourceConflictException } from 'src/exceptions'
import { prisma } from 'src/prisma'

export const getFactionCount = async () => {
  return prisma.faction.count()
}

export const getFactions = async () => {
  const factions = await prisma.faction.findMany({
    select: factionCompactSelect,
  })
  return factions.map((faction) => FactionCompact.strict().parse(faction))
}

export const createFaction = async (createFactionDTO: CreateFactionDTO) => {
  if (await exists(createFactionDTO.name))
    throw new ResourceConflictException(
      `Faction ${createFactionDTO.name} already exists`
    )
  const faction = await prisma.faction.create({
    data: createFactionDTO,
    select: factionSelect,
  })
  return Faction.strict().parse(faction)
}

const exists = async (name: string) => {
  const faction = await prisma.faction.findFirst({ where: { name } })
  return Boolean(faction)
}

const Faction = z.object({
  id: UUID,
  name: z.string().min(1),
  description: z.string().nullish(),
  createdAt: JSONDate,
  updatedAt: JSONDate,
})

const FactionCompact = Faction.omit({ description: true })

export const CreateFactionDTO = Faction.pick({ name: true, description: true })
type CreateFactionDTO = z.infer<typeof CreateFactionDTO>

const factionSelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  updatedAt: true,
}
const factionCompactSelect = {
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
}
