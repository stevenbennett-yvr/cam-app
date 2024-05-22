import { SupabaseClient } from "@supabase/supabase-js";
import _ from "lodash";

export type TableName =
  | "public_user"
  | "sect";

interface SelectFilter {
  column: string;
  value: undefined | null | string | number | boolean | string[] | number[];
  options?: {
    ignoreCase?: boolean;
    arrayContains?: boolean;
  };
}

export async function fetchData<T = Record<string, any>>(
  client: SupabaseClient<any, 'public', any>,
  tableName: TableName,
  filters: SelectFilter[]
) {
  let query = client.from(tableName).select();
  for (const filter of filters) {
    if (filter.value === undefined) continue;

    if (Array.isArray(filter.value)) {
      if (filter.value.length === 0) continue;
      if (filter.options?.arrayContains) {
        query = query.contains(filter.column, filter.value);
      } else {
        query = query.in(filter.column, filter.value);
      }
    } else {
      if (filter.options?.ignoreCase) {
        query = query.ilike(filter.column, `${filter.value}`);
      } else {
        if (filter.value === null) {
          query = query.is(filter.column, filter.value);
        } else {
          query = query.eq(filter.column, filter.value);
        }
      }
    }
  }
  const { data, error } = await query;
  if (error) throw error;

  return data as T[];
}