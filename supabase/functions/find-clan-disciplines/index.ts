import { serve } from "std/server";
import { connect, fetchData } from "../_shared/helpers.ts";
import { ClanDisciplines } from "../_shared/content.d.ts";

serve(async (req: Request) => {
  return await connect(req, async (client, body) => {
    let { id, discipline_id, clan_id, content_sources } = body as {
      id?: number | number[];
      discipline_id: number | number[];
      clan_id: number | number[];
      content_sources?: number[];
    };

    const results = await fetchData<ClanDisciplines>(
      client,
      "clan_discipline",
      [
        { column: "id", value: id },
        { column: "discipline_id", value: discipline_id },
        { column: "clan_id", value: clan_id },
      ],
    );

    const data = (id === undefined || Array.isArray(id))
      ? results
      : results.length > 0
      ? results[0]
      : null;
    return {
      status: "success",
      data,
    };
  });
});
