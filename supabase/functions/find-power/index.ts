import { serve } from 'std/server';
import { connect, fetchData } from '../_shared/helpers.ts';
import { Power } from '../_shared/content.d.ts'

serve(async (req:Request) => {
    return await connect(req, async (client, body) => {
        let { id, discipline_id, content_sources} = body as {
            id?: number | number[];
            discipline_id: number | number[];
            content_sources?: number[];
        };

        const results = await fetchData<Power>(client, 'power', [
            { column: 'id', value: id },
            { column: 'discipline_id', value: discipline_id },
        ]);

        const data = (id === undefined || Array.isArray(id)) ? results : results.length > 0 ? results[0] : null;
    return {
        status: 'success',
        data
    }
    })
});