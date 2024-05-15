import { ClanType } from "./kindredTypes/clan";

export type ContentType = 
    | 'sect'
    | 'clan'
    | 'predator-type'
    | 'content-source';


export interface Sect {
    id: number;
    name: string;
    description: string;
    artwork_url: string;
    content_source_id: number;
};

interface Trait {
    creationPoints: number,
    experiencePoints: number,
}

interface Attributes {
    strength: Trait,
    dexterity: Trait,
    stamina: Trait,

    charisma: Trait,
    manipulation: Trait,
    composure: Trait,

    intelligence: Trait,
    wits: Trait,
    resolve: Trait,
}

interface Skills {
    athletics: Trait,
    brawl: Trait,
    crafts: Trait,
    drive: Trait,
    firearms: Trait,
    melee: Trait,
    larceny: Trait,
    stealth: Trait,
    survival: Trait,

    "animal ken": Trait,
    etiquette: Trait,
    insight: Trait,
    intimidation: Trait,
    leadership: Trait,
    performance: Trait,
    persuasion: Trait,
    streetwise: Trait,
    subterfuge: Trait,

    academics: Trait,
    awareness: Trait,
    finance: Trait,
    investigation: Trait,
    medicine: Trait,
    occult: Trait,
    politics: Trait,
    science: Trait,
    technology: Trait,

}

interface Condition {
    name: string;
    description: string;
    value?: number;
    source?: string;
}

interface Entity {
    name: string;
    inventory?: array;
    attributes: Attributes,
    skills: Skills,
    details?: {
        image_url?: string;
    };
};

export type SectType = 
"Camarilla" |
"Autarkis" |
"Camarilla" |
""


interface Kindred extends Entity {
    id: number;
    created_at: string;
    vss_id?: number;
    user_id: string;

    notes?: {
        pages: {
            name: string;
            icon: string;
            color: string;
            contents: JSONContent;
        }[];
    };
    details?:{
        image_url?:string;
        background_image_url?: string;
        conditions?: Condition[];
        sect?: SectType;
        clan?: ClanType;
        info?: {
            history: string,
            goals: string,
            description: string,
            roleplaying_hints: string,
            haven: string,
            influence: string,
            derangements: string,
        };
    };
};

interface ContentSource {
    id: number;
    publish_date: string;
    name: string;
    url: string;
    description: string;
    line: string;
    artwork_url?: string;
}

