import { serve } from 'std/server';
import { connect } from '../_shared/helpers.ts';


serve(async (req: Request) => {
  return await connect(req, async (client, body) => {
    let { clan_id } = body as { clan_id: number };

    if (!clan_id) {
      return {
        status: 'error',
        error: 'clan_id is required'
      };
    }

    // Fetch the clan_disciplines with the joined discipline data
    const { data: clanDisciplines, error } = await client
      .from('clan_disciplines')
      .select(`
        *,
        discipline (*)
      `)
      .eq('clan_id', clan_id);

    if (error) {
      return {
        status: 'error',
        error: error.message
      };
    }

    return {
      status: 'success',
      data: clanDisciplines
    };
  });
});