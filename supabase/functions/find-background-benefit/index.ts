// @ts-ignore
import { serve } from 'std/server';
import { connect, fetchData } from '../_shared/helpers.ts';
import type { BackgroundBenefit } from '../_shared/content.d.ts';

serve(async (req: Request) => {
  return await connect(req, async (client, body) => {
    let { id, background_id, content_source_id} = body as {
      id?: number | number[];
      background_id?: number | number[];
      content_source_id?: number | number[];
    };

    const results = await fetchData<BackgroundBenefit>(client, 'background_benefit', [
      { column: 'id', value: id },
      { column: 'background_id', value: background_id },
      { column: 'content_source_id', value: content_source_id },
    ]);

    const data =
      id === undefined || Array.isArray(id) ? results : results.length > 0 ? results[0] : null;
    return {
      status: 'success',
      data,
    };
  });
});