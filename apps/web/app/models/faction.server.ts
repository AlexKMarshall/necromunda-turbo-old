import { prisma } from "~/db.server";

type FactionSummary = {
  id: string;
  name: string;
};

export async function getFactionCollection(): Promise<FactionSummary[]> {
  return prisma.faction.findMany({
    select: {
      id: true,
      name: true,
    },
  });
}
