// @ts-ignore
import { serve } from 'std/server';
import { connect, fetchData } from '../_shared/helpers.ts';
import type { LoresheetBenefit } from '../_shared/content.d.ts';

serve(async (req: Request) => {
  return await connect(req, async (client, body) => {
    let { id, loresheet_id} = body as {
      id?: number | number[];
      loresheet_id?: number | number[];
    };

    const results = await fetchData<LoresheetBenefit>(client, 'loresheet_benefit', [
      { column: 'id', value: id },
      { column: 'loresheet_id', value: loresheet_id },
    ]);

    const data =
      id === undefined || Array.isArray(id) ? results : results.length > 0 ? results[0] : null;
    return {
      status: 'success',
      data,
    };
  });
});