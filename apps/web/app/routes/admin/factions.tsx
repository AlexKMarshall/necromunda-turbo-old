import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { getPaginatedFactions } from "~/models/faction.server";
import * as D from "io-ts/Decoder";
import { flow, pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import { Pagination } from "~/components/pagination";

const numberFromString: D.Decoder<unknown, number> = pipe(
  D.string,
  D.parse((s) => {
    const n = Number(s);
    return isNaN(n) ? D.failure(s, "numberFromString") : D.success(n);
  })
);

const ParamsDecoder = D.partial({
  page: numberFromString,
  size: numberFromString,
});

const defaultPagination = { page: 1, size: 10 };

const applyDefaultParams = (params: D.TypeOf<typeof ParamsDecoder>) => ({
  ...defaultPagination,
  ...params,
});

const loaderPipeline = flow(
  ParamsDecoder.decode,
  TE.fromEither,
  TE.map(applyDefaultParams),
  TE.mapLeft((e) => D.draw(e)),
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
    console.log(result.error);
    throw new Response(JSON.stringify(result.error), { status: 500 });
  }

  return json(result.data);
};

export default function Admin() {
  const { results, page, size, count } = useLoaderData<typeof loader>();
  return (
    <main>
      <h1>Factions</h1>
      <ul>
        {results.map((faction) => (
          <li key={faction.id}>{faction.name}</li>
        ))}
      </ul>
      <Pagination currentPage={page} size={size} count={count} />
      <Link to="/admin/factions/new">New</Link>
      <Outlet />
    </main>
  );
}
