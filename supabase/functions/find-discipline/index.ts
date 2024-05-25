import { serve } from 'std/server';
import { connect, fetchData } from '../_shared/helpers.ts';
import { Discipline } from '../_shared/content.d.ts'

serve(async (req:Request) => {
    return await connect(req, async (client, body) => {
        let { id, content_sources} = body as {
            id?: number | number[];
            content_sources?: number[];
        };

        const results = await fetchData<Discipline>(client, 'discipline', [
            { column: 'id', value: id },
        ]);

        const data = (id === undefined || Array.isArray(id)) ? results : results.length > 0 ? results[0] : null;
    return {
        status: 'success',
        data
    }
    })
});