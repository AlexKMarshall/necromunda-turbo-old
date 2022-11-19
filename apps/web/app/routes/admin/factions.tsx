import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { getFactionCollection, getFactionCount } from "~/models/faction.server";

export const loader = async () => {
  const page = 1;
  const size = 20;
  return json({
    results: await getFactionCollection({ page, size }),
    count: await getFactionCount(),
    page,
    size,
  });
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
