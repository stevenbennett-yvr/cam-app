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
    baseValue: number
    experience: number
}

export interface TraitAttribute extends TraitBase {
    readonly category: Category;
    type: "attribute"
}

export interface TraitSkill extends TraitBase {
    readonly category: Category;
    type: "attribute"
}

export interface TraitDiscipline extends TraitBase {
    type: "discipline"
    inClan: boolean
}