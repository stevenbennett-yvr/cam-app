import { Trait, TraitType, TraitAttribute, Category } from "@typing/traits";
import { throwError } from "@utils/notifications";


export function newTrait(type: TraitType, name: string, baseValue: number, category?: Category): Trait {
    if ( type === "attribute" && category ) {
        return {
            name,
            type,
            category,
            baseValue,
            experience: 0
        } satisfies TraitAttribute
    } 
    
    throwError(`Innvalid variable type: ${type}`);
    return {} as Trait
}