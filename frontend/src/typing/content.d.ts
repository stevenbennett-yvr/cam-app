import { ClanType } from "./kindredTypes/clan";
import { Operation } from "./operations";
import { Trait } from "./traits";

type ContentPackage = {
  sects: Sect[];
  clans: Clan[];
  disciplines: Discipline[];
  powers: Power[];
  loresheets: Loresheet[];
  benefits: LoresheetBenefit[];
  backgrounds: Background[];
  sources?: ContentSource[];
}

export type ContentType =
  | "sect"
  | "sect_clans"
  | "clan"
  | "clan_disciplines"
  | "predator-type"
  | "content-source"
  | "discipline"
  | "power"
  | "loresheet"
  | "loresheet_benefit"
  | "background"
  | "background_benefit";

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

interface Quote {
  text: string,
  cite: string,
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
  quote: Quote;
};


export interface Discipline {
  id: number;
  created_at: string;
  name: string;
  type: string;
  masquerade_threat: string;
  resonance: string;
  quote: JSON;
  description: string;
  characteristics: Characteristic[];
  rombo: string;
  artwork: string;
  prerequisite_id: number;
};

export interface ChallengePool {
  offense: string[];
  defense?: string[];
  note?: string;
}

export interface Amalgam {
  discipline: number;
  level: number;
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
  challenge_pool?: ChallengePool;
  amalgam?: Amalgam;
  description: string;
  prerequisite_id?: number;
  process?: string;
  ingredients?: Characteristic[];
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
};

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

interface Condition {
  name: string;
  description: string;
  value?: number;
  source?: string;
}

interface Entity {
  id: number;
  created_at: string;
  name: string;
  operations: Operation[] | undefined;
}

interface Kindred extends Entity {
  generation?: number;
  details?: {
    image_url?: string;
    generation?: number;
    sectID?: number;
    clanID?: number;
    predator_type?: JSON;
  }
}


interface ContentSource {
  id: number;
  created_at: string;
  name: string;
  url: string;
  description: string;
  splat: string;
  edition: string;
}

interface SectClans {
  id: number;
  created_at: string;
  clan: Clan;
  sect_id: number;
  clan_id: number;
  note: string;
}

interface ClanDisciplines {
  id: number;
  created_at: string;
  discipline: Discipline;
  clan_id: number;
  discipline_id: number;
  note: string;
}