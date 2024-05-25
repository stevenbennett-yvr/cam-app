// @ts-ignore
import { serve } from 'std/server';
import { connect, fetchData } from '../_shared/helpers.ts';
import type { Loresheet } from '../_shared/content.d.ts';

serve(async (req: Request) => {
  return await connect(req, async (client, body) => {
    let { id, content_sources, sect_id, clan_id} = body as {
      id?: number | number[];
      sect_id?: number | number[];
      clan_id?: number | number[];
      content_sources?: number[];
    };

    const results = await fetchData<Loresheet>(client, 'loresheet', [
      { column: 'id', value: id },
      { column: 'content_source_id', value: content_sources },
      { column: 'sect_id', value: sect_id },
      { column: 'clan_id', value: clan_id },

    ]);

    const data =
      id === undefined || Array.isArray(id) ? results : results.length > 0 ? results[0] : null;
    return {
      status: 'success',
      data,
    };
  });
});