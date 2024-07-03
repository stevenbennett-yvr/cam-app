import { ClanType } from "./kindredTypes/clan";
import { Operation } from "./operations";
import { Trait } from "./traits";

type ContentPackage = {
  sources?: ContentSource[];
  backgrounds: Background[];
  background_benefits: BackgroundBenefit[];
  clans: Clan[];
  clan_disciplines: ClanDisciplines[];
  disciplines: Discipline[];
  loresheets: Loresheet[];
  loresheet_benefits: LoresheetBenefit[];
  merit_flaws: MeritFlaw[];
  powers: Power[];
  sects: Sect[];
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
  | "background_benefit"
  | "merit_flaw";

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

interface characteristic {
  label: string,
  text: string,
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
  characteristics: characteristic[]  
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

export interface PowerSlot {
  rank: number;
  discipline_id?: number;
  power_id?: number;
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

type meritFlawCategory =
  | "bonding"
  | "connection"
  | "feeding"
  | "mythical"
  | "physical"
  | "psychological"
  | "thin-blood"
  | "ghoul";

type meritFlawType =
  | "merit"
  | "flaw";

export interface MeritFlaw {
  id: number;
  created_at: string;
  content_source_id: number;
  category: meritFlawCategory;
  type: meritFlawType;
  levels: number[];
  name: string;
  prerequisites?: string[];
  description: string;
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
  operations: Operation[];
  powers?: {
    slots: PowerSlot[];
  }
}

interface Kindred extends Entity {
  generation?: number;
  clanOperations: Operation[];
  details?: {
    image_url?: string;
    generation?: number;
    sectID?: number;
    clanID?: number;
    predator_type?: JSON;
  };
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
  clan_id: number;
  discipline_id: number;
  note: string;
  discipline?: Discipline;
}