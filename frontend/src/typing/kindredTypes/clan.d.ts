
import { DisciplineType } from "./disciplines"

export type ClanType = 
"Banu Haqim" |
"Brujah" |
"Caitiff" |
"Gangrel" |
"Hecata" |
"Lasombra" |
"Malkavian" |
"Ministry" |
"Nosferatu" |
"Ravnos" |
"Salubri" |
"Thin-Blood" |
"Toreador" |
"Tremere" |
"Tzimisce" |
"Ventrue" |
""


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
  }