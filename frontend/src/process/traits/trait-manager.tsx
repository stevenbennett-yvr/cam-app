import { Trait } from "@typing/traits"
import { newTrait } from "./trait-utils"

const DEFAULT_TRAITS: Record<string, Trait> = {
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
        "attribute", "dexterity", 1, "social"
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
}