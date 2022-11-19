import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { getFactionCollection } from "~/models/faction.server";

export const loader = async () => {
  return json({
    factions: await getFactionCollection(),
  });
};

export default function Admin() {
  const { factions } = useLoaderData<typeof loader>();
  return (
    <main>
      <h1>Factions</h1>
      <ul>
        {factions.map((faction) => (
          <li key={faction.id}>{faction.name}</li>
        ))}
      </ul>
      <Link to="/admin/factions/new">New</Link>
      <Outlet />
    </main>
  );
}
