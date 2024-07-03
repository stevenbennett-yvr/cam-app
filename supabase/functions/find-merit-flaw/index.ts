// @ts-ignore
import { serve } from 'std/server';
import { connect, fetchData } from '../_shared/helpers.ts';
import type { BackgroundBenefit } from '../_shared/content.d.ts';

serve(async (req: Request) => {
  return await connect(req, async (client, body) => {
    let { id, content_source_id, type, category} = body as {
    id?: number | number[];
    content_source_id?: number | number[];
    type?: string;
    category?: string;
    };

    const results = await fetchData<BackgroundBenefit>(client, 'merit_flaw', [
      { column: 'id', value: id },
      { column: 'content_source_id', value: content_source_id },
      { column: 'type', value: type },
      { column: 'category', value: category },
    ]);

    const data =
      id === undefined || Array.isArray(id) ? results : results.length > 0 ? results[0] : null;
    return {
      status: 'success',
      data,
    };
  });
});