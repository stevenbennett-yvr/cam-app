

type ContentType =
  | 'sect'
  | 'clan'
  | 'discipline'
  | 'content-source'
  | 'loresheet'
  | 'loresheet-benefit'
  | 'power'
  | 'background'
  | 'background-benefit';

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
  rombo: string;
  artwork: string;
  prerequisite_id: number;
}

export interface Power {
  id: number;
  created_at: string;
  name: string;
  level: number;
  discipline_id: number;
  content_source_id: number;
  cost: string;
  summary: string;
  duration: string;
  challenge_pool: JSON;
  amalgam: JSON;
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

export interface LoresheetBenefit {
  id: number;
  loresheet_id: number;
  created_at: string;
  name: string;
  description: string;
  level: number;
}

export interface Background {
  id: number;
  created_at: string;
  name: string;
  description: string;
}

export interface BackgroundBenefit {
  id: number;
  created_at: string;
  name: string;
  description: string;
  type: string;
  levels: number[];
  background_id: number;
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

interface ContentUpdate {
  id: number;
  created_at: string;
  user_id: string;
  type: ContentType;
  ref_id?: number;
  action: 'UPDATE' | 'CREATE' | 'DELETE';
  data: Record<string, any>;
  content_source_id: number;
  status: {
    state: 'PENDING' | 'APPROVED' | 'REJECTED';
    discord_user_id?: string;
    discord_user_name?: string;
  };
  upvotes: {
    discord_user_id: string;
  }[];
  downvotes: {
    discord_user_id: string;
  }[];
  discord_msg_id?: string;
}