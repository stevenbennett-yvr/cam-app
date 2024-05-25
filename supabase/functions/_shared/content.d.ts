

type ContentType =
  | 'sect'
  | 'clan'
  | 'discipline'
  | 'content-source'
  | 'loresheet';

export interface Sect {
  id: number;
  created_at: string;
  name: string;
  nicknames: string;
  description: string;
  artwork: string;
  logo: string;
  symbol: string;
  content_source_id: number;
}

export interface Clan {
  id: number;
  name: string;
  created_at: string;
  nicknames: string;
  summary: string;
  description: string;
  logo: string;
  symbol: string;
  artwork: string;
  bane: string;
  compulsion: string;
  quote: JSON;
}

export interface Discipline {
  id: number;
  created_at: string;
  name: string;
  type: string;
  masquerade_threat: string;
  resonance: string;
  quote: JSON;
  description: string;
  characteristics: JSON;
}

export interface Loresheet {
  id: number;
  created_at: string;
  name: string;
  description: string;
  artwork: string;
  sect_id: number;
  clan_id: number;
  content_source_id: number;
}

// All requests follow JSend specification (https://github.com/omniti-labs/jsend) //
type JSendResponse = JSendResponseSuccess | JSendResponseFail | JSendResponseError;
interface JSendResponseSuccess {
  status: 'success';
  data: NonNullable<any>;
}
interface JSendResponseFail {
  status: 'fail';
  data: NonNullable<any>;
}
interface JSendResponseError {
  status: 'error';
  message: string;
  data?: NonNullable<any>;
  code?: number;
}

interface PublicUser {
  id: number;
  user_id: string;
  created_at: string;
  display_name: string;
  image_url?: string;
  background_image_url?: string;
  site_theme?: {
    color: string;
  };
  is_admin: boolean;
  is_mod: boolean;
  is_developer?: boolean;
  deactivated: boolean;
  summary?: string;
}

interface ContentSource {
  id: number;
  created_at: string;
  name: string;
  url: string;
  description: string;
  splat: string;
  edition: string;
  meta_data?: {
    counts?: Record<ContentType, number>;
  };
}