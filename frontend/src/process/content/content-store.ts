import { Loresheet, Discipline, ContentType, SectClans, ClanDisciplines, Power, ContentPackage, ContentSource, Sect, Clan, LoresheetBenefit, Background } from "../../typing/content";
import { hashData } from "../../utils/numbers";
import { RequestType } from "../../typing/requests";
import _ from 'lodash-es';
import { makeRequest } from "../../request/request-manager";

// Storing


const contentStore = new Map<number, any>();

function hashFetch(type: ContentType, data: Record<string, any>) {
    return hashData({ type,data })
}

function getStoredFetch(type: ContentType, data: Record<string, any>) {
    return contentStore.get(hashFetch(type, data));
}

function setStoredFetch(type: ContentType, data: Record<string, any>, value: any) {
    contentStore.set(hashFetch(type,data), value);
}

let idStore = emptyIdStore();

function emptyIdStore() {
    let newStore = new Map<ContentType, Map<number, Record<string, any> | null>>();
    newStore.set('clan', new Map());
    newStore.set('predator-type', new Map());
    newStore.set('sect', new Map());

    return newStore;
  }

function getStoredNames(type: ContentType, data: Record<string, any>) {
    if (!data.name) return null;
    if (_.isString(data.name)) {
      const contentMap = idStore.get(type);
      if (!contentMap) return null;
      for (const content of contentMap.values()) {
        if (content?.name && content.name.toUpperCase().trim() === data.name.toUpperCase().trim()) {
          return content;
        }
      }
    }
    return null;
}

function getStoredIds(type: ContentType, data: Record<string, any>) {
    if (!data.id) return null;
    if (Array.isArray(data.id)) {
      const results = data.id.map((id) => idStore.get(type)?.get(parseInt(id))).filter((result) => result);
      if (results.length !== data.id.length) return null;
      return results;
    } else {
      const id = parseInt(data.id);
      return idStore.get(type)?.get(id);
    }
  }
  
  function setStoredIds(type: ContentType, data: Record<string, any>, value: any) {
    // Handle content source dumps
    if (Array.isArray(value)) {
      for (const v of value) {
        if (!v.id) return 'Value is not an array of objects with ids';
        idStore.get(type)?.set(v.id, v);
      }
      return true;
    }
  
    // Handle individual ids
    if (!data.id) return true;
    if (Array.isArray(data.id)) {
      if (!Array.isArray(value)) return 'Value is not an array';
      for (const v of value) {
        if (!v.id) return 'Value is not an array of objects with ids';
        idStore.get(type)?.set(v.id, v);
      }
    } else {
      if (Array.isArray(value) || !value.id) return 'Value is not an object with an id';
      idStore.get(type)?.set(value.id, value);
    }
    return true;
  }

/// Fetching

let defaultSources: number[] | undefined = undefined; // undefined means all sources
export function defineDefaultSources(sources?: number[]) {
  defaultSources = sources ? _.uniq(sources) : undefined;
}

export function getDefaultSources() {
  return _.cloneDeep(defaultSources ?? []);
}

export function getCachedSources(): ContentSource[] {
  return [...(idStore.get('content-source')?.values() ?? [])].filter((source) => source) as ContentSource[];
}

export async function fetchContentById<T = Record<string, any>>(type: ContentType, id: number, sources?: number[]) {
  if (!id || id === -1) return null;
  return await fetchContent<T>(type, { id, content_sources: sources });
}

export async function fetchContentAll<T = Record<string, any>>(type: ContentType, sources?: number[]) {
  const result = await fetchContent<T>(type, { content_sources: sources });
  if (result) {
    return result as T[];
  } else {
    return [];
  }
}

export async function fetchContent<T=Record<string, any>>(
    type: ContentType,
    data: Record<string, any>,
    dontStore?: boolean,
) {
    const FETCH_REQUEST_MAP: Record<ContentType, RequestType> = {
        'clan': 'find-clan',
        'content-source': 'find-content-source',
        'predator-type': 'find-predator-type',
        'sect': 'find-sect',
        'sect_clans': 'find-sect-clans',
        'clan_disciplines': 'find-clan-disciplines',
        'discipline': 'find-discipline',
        'loresheet': 'find-loresheet',
        'loresheet_benefit': "find-loresheet-benefit",
        'power' : 'find-power',
        'background' : 'find-background',
        'background_benefit' : 'find-background-benefit'
    };

    const storedIds = getStoredIds(type, data);
    const storedFetch = getStoredFetch(type, data);
    const storedNames = getStoredNames(type, data);

    if (storedFetch) {
        return storedFetch as T;
      } else if (storedIds) {
        return storedIds as T;
      } else if (storedNames) {
        return storedNames as T;
      } else {
        // Make sure we're always filtering by content source
        const newData = { ...data };
        if (type !== 'content-source' && !newData.content_sources) {
          // This will fetch the default content sources...
          const sources = await fetchContentSources();
          newData.content_sources = sources.map((source) => source.id);
        }
    
        const result = await makeRequest<T>(FETCH_REQUEST_MAP[type], newData);
        if (result && !dontStore) {
          setStoredFetch(type, data, result);
          const added = setStoredIds(type, data, result);
          if (added !== true) console.error('Failed to add to id store', added, data, result);
        }
        return result;
      }
}

export function resetContentStore(resetSources = true) {
    console.warn('⚠️ Resetting Content Store ⚠️');
    if (resetSources) {
      defineDefaultSources([]);
    }
    contentStore.clear();
    idStore = emptyIdStore();
  }

// Utility Functions

export async function fetchContentSources(options?: {
    group?: string;
    ids?: number[] | 'all';
  }) {
    const sources = await fetchContent<ContentSource[]>('content-source', {
      group: options?.group,
      id: options?.ids === 'all' ? undefined : options?.ids ?? defaultSources,
    });
    if (!sources) {
      return [];
    }
    return sources.sort((a, b) => a.name.localeCompare(b.name));
  }

export async function fetchSectClans(sect_id: number) {
  const sectClans = await makeRequest<SectClans[]>('find-sect-clans', {
    sect_id
  });
  if (!sectClans) {
    return [];
  }

  return sectClans?.sort((a,b) => a.clan.name.localeCompare(b.clan.name))
}

export async function fetchClanDisciplines(clan_id: number) {
  const clanDisciplines = await makeRequest<ClanDisciplines[]>('find-clan-disciplines', {
    clan_id
  });
  if (!clanDisciplines) {
    return [];
  }
  return clanDisciplines
}

export async function fetchContentPackage(
  sources?: number[],
  options?: {
    fetchSources?: boolean;
  }
): Promise<ContentPackage> {
  const content = await Promise.all([
    fetchContentAll<Sect>('sect', sources),
    fetchContentAll<Clan>('clan', sources),
    fetchContentAll<Discipline>('discipline', sources),
    fetchContentAll<Power>('power', sources),
    fetchContentAll<Loresheet>('loresheet', sources),
    fetchContentAll<LoresheetBenefit>('loresheet_benefit', sources),
    fetchContentAll<Background>('background', sources),
    options?.fetchSources ? fetchContentSources({ ids: sources }) : null
  ]);

  return {
    sects: ((content[0] ?? []) as Sect[]).sort((a, b) => a.name.localeCompare(b.name)),
    clans: ((content[1] ?? []) as Clan[]).sort((a, b) => a.name.localeCompare(b.name)),
    disciplines: ((content[2] ?? []) as Discipline[]).sort((a, b) => a.name.localeCompare(b.name)),
    powers: ((content[3] ?? []) as Power[]).sort((a, b) => a.name.localeCompare(b.name)),
    loresheets: ((content[4] ?? []) as Loresheet[]).sort((a, b) => a.name.localeCompare(b.name)),
    benefits: ((content[5] ?? []) as LoresheetBenefit[]).sort((a, b) => a.name.localeCompare(b.name)),
    backgrounds:  ((content[6] ?? []) as Background[]).sort((a, b) => a.name.localeCompare(b.name)),
    sources: content[7] as ContentSource[]
  } satisfies ContentPackage
}