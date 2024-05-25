// @ts-ignore
import { serve } from 'std/server';
import { connect, fetchData } from '../_shared/helpers.ts';
import type { ContentSource } from '../_shared/content.d.ts';

serve(async (req: Request) => {
  return await connect(req, async (client, body) => {
    let { id } = body as {
      id?: number | number[];
    };

    let results = await fetchData<ContentSource>(client, 'content_source', [
      { column: 'id', value: id }
    ]);

    const data =
      (id === undefined || Array.isArray(id))
        ? results
        : results.length > 0
        ? results[0]
        : null;
    return {
      status: 'success',
      data,
    };
  });
});