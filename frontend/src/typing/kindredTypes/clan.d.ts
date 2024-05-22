
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
    id: number,
    name: ClanType,
    nicknames: string,
    description: string,
    logo: string,
    symbol: string,
    bane: string,
    compulsion: string,
    disciplines: DisciplineType[]
}