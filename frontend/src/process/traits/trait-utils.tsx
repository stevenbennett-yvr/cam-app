import { Trait, TraitType, TraitAttribute, Category, TraitSkill } from "@typing/traits";
import { throwError } from "@utils/notifications";


export function newTrait(type: TraitType, name: string, value: number, category?: Category): Trait {
    if ( type === "attribute" && category ) {
        return {
            name,
            type,
            category,
            value,
        } satisfies TraitAttribute
    } 
    if ( type === "skill" && category ) {
        return {
            name,
            type,
            category,
            value,
        } satisfies TraitSkill
    } 
    
    throwError(`Innvalid variable type: ${type}`);
    return {} as Trait
}