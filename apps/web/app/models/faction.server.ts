import { prisma } from "~/db.server";

type FactionSummary = {
  id: string;
  name: string;
};

type GetFactionCollectionArgs = {
  page?: number;
  size?: number;
};
export async function getFactionCollection({
  page = 1,
  size = 20,
}: GetFactionCollectionArgs = {}): Promise<FactionSummary[]> {
  const skip = (page - 1) * size;

  return prisma.faction.findMany({
    select: {
      id: true,
      name: true,
    },
    take: size,
    skip,
  });
}

export async function getFactionCount(): Promise<number> {
  return prisma.faction.count();
}
