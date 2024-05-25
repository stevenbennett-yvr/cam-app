import { serve } from 'std/server';
import { connect } from '../_shared/helpers.ts';


serve(async (req: Request) => {
  return await connect(req, async (client, body) => {
    let { sect_id } = body as { sect_id: number };

    if (!sect_id) {
      return {
        status: 'error',
        error: 'sect_id is required'
      };
    }

    // Fetch the sect_clans with the joined clan data
    const { data: sectClans, error } = await client
      .from('sect_clans')
      .select(`
        *,
        clan (*)
      `)
      .eq('sect_id', sect_id);

    if (error) {
      return {
        status: 'error',
        error: error.message
      };
    }

    return {
      status: 'success',
      data: sectClans
    };
  });
});