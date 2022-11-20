import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { getPaginatedFactions } from "~/models/faction.server";
import * as D from "io-ts/Decoder";
import { flow, pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";

const numberFromString: D.Decoder<string, number> = {
  decode: (s) => {
    const n = Number(s);
    return isNaN(n) ? D.failure(s, "NumberFromString") : D.success(n);
  },
};

const serializedNumber = pipe(D.string, D.compose(numberFromString));

const ParamsDecoder = D.struct({
  page: serializedNumber,
  size: serializedNumber,
});

const loaderPipeline = flow(
  ParamsDecoder.decode,
  TE.fromEither,
  TE.chainW(getPaginatedFactions),
  TE.mapLeft((e) => ({ status: "error", error: e })),
  TE.map((factions) => ({ status: "success", data: factions })),
  TE.toUnion
);

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());
  const result = await loaderPipeline(params)();

  if ("error" in result) {
    throw new Response(JSON.stringify(result.error), { status: 500 });
  }

  return json(result.data);
};

export default function Admin() {
  const { results } = useLoaderData<typeof loader>();
  return (
    <main>
      <h1>Factions</h1>
      <ul>
        {results.map((faction) => (
          <li key={faction.id}>{faction.name}</li>
        ))}
      </ul>
      <Link to="/admin/factions/new">New</Link>
      <Outlet />
    </main>
  );
}
