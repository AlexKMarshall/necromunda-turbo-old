import * as TE from "fp-ts/TaskEither";
import { prisma } from "~/db.server";
import { DBError } from "~/errors";
import { pipe } from "fp-ts/function";

type GetFactionCollectionArgs = { page: number; size: number };
export function getFactionCollection({ page, size }: GetFactionCollectionArgs) {
  const skip = (page - 1) * size;

  return TE.tryCatch(
    () =>
      prisma.faction.findMany({
        select: {
          id: true,
          name: true,
        },
        take: size,
        skip,
      }),
    DBError.of
  );
}

export function getFactionCount() {
  return TE.tryCatch(() => prisma.faction.count(), DBError.of);
}

export const getPaginatedFactions = ({
  page,
  size,
}: GetFactionCollectionArgs) =>
  pipe(
    TE.Do,
    TE.apS("results", getFactionCollection({ page, size })),
    TE.apS("count", getFactionCount()),
    TE.map(({ results, count }) => ({ results, count, page, size }))
  );
