
export type StoreID = "CHARACTER" | string;
export type TraitStore = {
    traits: Record<string, Trait>;
    bonuses: Record<string, { value?: number; type?: string; text: string; source: string; timestamp: number }[]>;
    history: Record<string, { to: number; from: number | null; source: string; timestamp: number }[]>;
}

export type TraitType =
| "attribute"
| "skill"
| "discipline"

export type Category =
| "mental"
| "physical"
| "social"

export type Trait = TraitAttribute | TraitSkill | TraitDiscipline

interface TraitBase {
    name: string;
    readonly type: TraitType;
    value: number;
}

export interface TraitAttribute extends TraitBase {
    readonly category: Category;
    type: "attribute"
}

export interface TraitSkill extends TraitBase {
    readonly category: Category;
    type: "skill"
}

export interface TraitDiscipline extends TraitBase {
    type: "discipline"
    inClan: boolean
}