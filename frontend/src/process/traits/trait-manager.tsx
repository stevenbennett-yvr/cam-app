import { Trait, TraitStore, StoreID, TraitType, TraitAttribute, TraitSkill, Category } from "@typing/traits"
import { newTrait } from "./trait-utils"
import _ from "lodash";
import { throwError } from "@utils/notifications";

export const DEFAULT_TRAITS: Record<string, Trait> = {

    /* Attributes */
    ATTRIBUTE_strength: newTrait(
        "attribute", "strength", 1, "physical"
    ),
    ATTRIBUTE_dexterity: newTrait(
        "attribute", "dexterity", 1, "physical"
    ),
    ATTRIBUTE_stamina: newTrait(
        "attribute", "stamina", 1, "physical"
    ),
    ATTRIBUTE_charisma: newTrait(
        "attribute", "charisma", 1, "social"
    ),
    ATTRIBUTE_manipulation: newTrait(
        "attribute", "manipulation", 1, "social"
    ),
    ATTRIBUTE_composure: newTrait(
        "attribute", "composure", 1, "social"
    ),
    ATTRIBUTE_intelligence: newTrait(
        "attribute", "intelligence", 1, "mental"
    ),
    ATTRIBUTE_wits: newTrait(
        "attribute", "wits", 1, "mental"
    ),
    ATTRIBUTE_resolve: newTrait(
        "attribute", "resolve", 1, "mental"
    ),

    /* Skills */
    SKILL_athletics: newTrait(
        "skill", "athletics", 0, "physical"
    ),
    SKILL_brawl: newTrait(
        "skill", "brawl", 0, "physical"
    ),
    SKILL_craft: newTrait(
        "skill", "craft", 0, "physical"
    ),
    SKILL_driving: newTrait(
        "skill", "driving", 0, "physical"
    ),
    SKILL_marksmanship: newTrait(
        "skill", "marksmanship", 0, "physical"
    ),
    SKILL_larceny: newTrait(
        "skill", "larceny", 0, "physical"
    ),
    SKILL_melee: newTrait(
        "skill", "melee", 0, "physical"
    ),
    SKILL_stealth: newTrait(
        "skill", "stealth", 0, "physical"
    ),
    SKILL_survival: newTrait(
        "skill", "survival", 0, "physical"
    ),
    SKILL_animal_ken: newTrait(
        "skill", "animal ken", 0, "social"
    ),
    SKILL_etiquette: newTrait(
        "skill", "etiquette", 0, "social"
    ),
    SKILL_insight: newTrait(
        "skill", "insight", 0, "social"
    ),
    SKILL_intimidation: newTrait(
        "skill", "intimidation", 0, "social"
    ),
    SKILL_leadership: newTrait(
        "skill", "leadership", 0, "social"
    ),
    SKILL_performance: newTrait(
        "skill", "performance", 0, "social"
    ),
    SKILL_persuasion: newTrait(
        "skill", "persuasion", 0, "social"
    ),
    SKILL_streetwise: newTrait(
        "skill", "streetwise", 0, "social"
    ),
    SKILL_subterfuge: newTrait(
        "skill", "subterfuge", 0, "social"
    ),
    SKILL_academics: newTrait(
        "skill", "academics", 0, "mental"
    ),
    SKILL_awareness: newTrait(
        "skill", "awareness", 0, "mental"
    ),
    SKILL_finance: newTrait(
        "skill", "finance", 0, "mental"
    ),
    SKILL_investigation: newTrait(
        "skill", "investigation", 0, "mental"
    ),
    SKILL_medicine: newTrait(
        "skill", "medicine", 0, "mental"
    ),
    SKILL_occult: newTrait(
        "skill", "occult", 0, "mental"
    ),
    SKILL_politics: newTrait(
        "skill", "politics", 0, "mental"
    ),
    SKILL_science: newTrait(
        "skill", "science", 0, "mental"
    ),
    SKILL_technology: newTrait(
        "skill", "technology", 0, "mental"
    ),
}

const traitMap = new Map<string, TraitStore>();

export function getTraitStore(id: StoreID) {
    if (!traitMap.has(id)) {
        traitMap.set(id, {
            traits: _.cloneDeep(DEFAULT_TRAITS),
            bonuses: {},
            history: {},
        });
    }
    return traitMap.get(id)!;
}

export function getTraits(id: StoreID) {
    return getTraitStore(id).traits;
}

export function getTrait<T = Trait>(id: StoreID, name: string): T | null {
    return _.cloneDeep(getTraits(id)[name]) as T | null;
}

export function getTraitBonuses(id: StoreID, name: string) {
    return _.cloneDeep(getTraitStore(id).bonuses[name]) ?? [];
}

export function addTraitBonus(
    id: StoreID,
    name: string,
    value: number | undefined,
    type: string | undefined,
    text: string,
    source: string,
) {
    if (!getTraitStore(id).bonuses[name]) {
        getTraitStore(id).bonuses[name] = [];
    }

    if (
        getTraitStore(id).bonuses[name].some(
            (bonus) => bonus.value === value && bonus.type === type && bonus.text === text && bonus.source == source
        )
    ) {
        return;
    }

    getTraitStore(id).bonuses[name].push({
        value,
        type,
        text,
        source,
        timestamp: Date.now()
    })
}

export function getTraitHistory(id: StoreID, name: string) {
    return _.cloneDeep(getTraitStore(id).history[name]) ?? [];
}

export function addTraitHistory(id: StoreID, name: string, to: number, from: number, source: string) {
    if (_.isEqual(from, to)) return;
    if (!getTraitStore(id).history[name]) {
        getTraitStore(id).history[name] = [];
    }
    getTraitStore(id).history[name].push({
        to: _.cloneDeep(to),
        from: _.cloneDeep(from),
        source,
        timestamp: Date.now(),
    });
}

export function addTrait(
    id: StoreID,
    type: TraitType,
    name: string,
    defaultValue: number,
    source?: string
) {
    let trait = getTraits(id)[name];

    /// need adjust variable function
    // else
    trait = newTrait(type, name, defaultValue)
    getTraits(id)[trait.name] = trait;

    return _.cloneDeep(trait)
}


export function removeTrait(id: StoreID, name: string) {
    delete getTraits(id)[name];
}

export function resetTraits(id?: StoreID) {
    if (id) {
        traitMap.delete(id);
    } else {
        traitMap.clear();
    }
}


export function setTrait(id: StoreID, name: string, value: number, source?: string) {
    let trait = getTraits(id)[name];
    if (!trait) {
        throwError(`Invalid variable name: ${name}`);
    }
    const oldValue = _.cloneDeep(trait.value)

    if (!trait) throwError(`Invalid trait name: ${name}`);
    /// sort of unecessary but if I want to create a trait that is not a value then it might be useful.
    if (_.isNumber(+value)) {
        trait.value = value
    }

    addTraitHistory(id, trait.name, trait.value, oldValue, source ?? "Updated" );
}


export function adjVariable(id: StoreID, name: string, amount: number, source?: string ) {
    let trait = getTraits(id)[name];
    if (!trait) {
        throwError(`Invalid trait name: ${name}`)
    }
    const oldValue = _.cloneDeep(trait.value)

    if (!trait) throwError(`Invalid trait name: ${name}`)
    if (_.isNumber(trait.value) && _.isNumber(+amount)) {
        trait.value += parseInt(`${amount}`)
    } else {
        throwError(`Invalid adjust amount for variable: ${name}, ${JSON.stringify(amount)}`)
    }

    addTraitHistory(id, trait.name, trait.value, oldValue, source ?? "Adjusted")
}

export function getAttributesTraits(id: StoreID, category?: Category): TraitAttribute[] {
    const order = [
        "strength",
        "dexterity",
        "stamina",
        "charisma",
        "manipulation",
        "composure",
        "intelligence",
        "wits",
        "resolve"
    ];

    const traits = [];
    for (const trait of Object.values(getTraits(id))) {
        if (trait.type === "attribute" && (!category || trait.category === category)) {
            traits.push(trait);
        }
    }

    return (traits as TraitAttribute[]).sort((a, b) => {
        return order.indexOf(a.name) - order.indexOf(b.name);
    });
}

export function getAllSkillTraits(id: StoreID, category?: Category): TraitSkill[] {

    const order = [
        "physical",
        "social",
        "mental"
    ];

    const traits = [];
    for (const trait of Object.values(getTraits(id))) {
        if (trait.type === "skill" && (!category || trait.category === category)) {
            traits.push(trait);
        }
    }

    return traits.sort((a, b) => {
        const categoryComparison = order.indexOf(a.category) - order.indexOf(b.category);
        if (categoryComparison !== 0) {
            return categoryComparison; // If categories are different, return the comparison result
        }
        return a.name.localeCompare(b.name);
    });

}