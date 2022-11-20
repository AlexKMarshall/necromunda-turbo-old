import { Form } from "@remix-run/react";
import * as T from "fp-ts/Task";
import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { pipe } from "fp-ts/function";
import * as N from "@necromunda/domain";
import * as TE from "fp-ts/TaskEither";
import { prisma } from "~/db.server";

const checkFactionNameExists = (name: string) => {
  return pipe(
    TE.tryCatch(
      () => prisma.faction.findUnique({ where: { name } }),
      DBError.of
    ),
    TE.map(Boolean)
  );
};

const saveFactionInDb = (faction: N.Faction.ValidatedFaction) => {
  return pipe(
    TE.tryCatch(() => prisma.faction.create({ data: faction }), DBError.of)
  );
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const formDataEntries = Object.fromEntries(formData.entries()) as any;

  return pipe(
    formDataEntries,
    N.Faction.createFaction({
      checkFactionNameExists,
    }),
    TE.map(({ factionCreated }) => factionCreated),
    TE.chainW(saveFactionInDb),
    TE.foldW(
      (e) => {
        console.error(e);
        return T.of(e);
      },
      (success) => {
        console.log({ success });
        return T.of(redirect("/admin/factions"));
      }
    )
  )();
};

export default function FactionsNew() {
  return (
    <div>
      <h2>Create faction</h2>
      <Form method="post">
        <label>
          name:
          <input
            type="text"
            name="name"
            required
            minLength={2}
            maxLength={50}
          />
        </label>
        <label>
          description:
          <textarea name="description" maxLength={200} />
        </label>
        <button type="submit">submit</button>
      </Form>
    </div>
  );
}

export class DBError extends Error {
  public _tag: "DBError";
  public innerError?: unknown;

  private constructor(innerError?: unknown) {
    super("Unexpected database error");
    this.innerError = innerError;
    this._tag = "DBError";
  }

  public static of(innerError?: unknown) {
    return new DBError(innerError);
  }
}
