import {
  FunctionsFetchError,
  FunctionsHttpError,
  FunctionsRelayError,
} from "@supabase/supabase-js";
import { supabase } from "../main";
import { JSendResponse, RequestType } from "../typing/requests";
import { displayError, throwError } from "../utils/notifications";
import { SupabaseClient } from "@supabase/supabase-js";
import { Sect } from "@typing/content";

type TableName = "sect" | "clan";

interface SelectFilter {
  column: string;
  value: undefined | null | string | number | boolean | string[] | number[];
  options?: {
    ignoreCase?: boolean;
    arrayContains?: boolean;
  };
}

export async function fetchData<T = Record<string, any>>(
  client: SupabaseClient<any, "public", any>,
  tableName: TableName,
  filters: SelectFilter[],
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
  return { data, error }
}

function handleQuery(
  type: RequestType,
  body: Record<string, any>,
) {
  let results;
  let { id, content_sources } = body as {
    id?: number | number[];
    content_sources?: number[];
  };

  let filters = [
    { column: "id", value: id },
    { column: "content_source_id", value: content_sources },
  ];

  switch (type) {
    case "find-sect":
      results = fetchData<Sect>(supabase, 'sect', filters)
      break;
    // Add more cases as needed for different query types
    default:
      console.error("Unknown request type");
      return null;
  }
  
  return results;
}

const MAX_ATTEMPTS = 3;
export async function makeRequest<T = Record<string, any>>(
  type: RequestType,
  body: Record<string, any>,
  attempt = 1,
): Promise<T | null> {
  const results = handleQuery(type, body);

  if (!results) {
    console.error("Invalid query generated");
    return null;
  }

  try {
    const { data, error } = await results;

    if (error) {
      if (error instanceof FunctionsHttpError) {
        const errorMessage = await error.context.json();
        console.error("Request Function returned an error", errorMessage);
      } else if (error instanceof FunctionsRelayError) {
        console.error("Request Relay error:", error.message);
      } else if (error instanceof FunctionsFetchError) {
        console.error("Request Fetch error:", error.message);
        if (attempt <= MAX_ATTEMPTS) {
          return await makeRequest<T>(type, body, attempt + 1);
        }
      } else {
        console.error("Request Unknown error:", error);
      }
      return null;
    }

    if (!data) {
      return null;
    }
    return data as T;

  } catch (err) {
    console.error("An error occurred while making the request:", err);
    return null;
  }
}
