import { StoreID } from "@typing/traits";
import { getTraitBonuses, getTrait, adjVariable } from "./trait-manager";


export function getTraitBreakdown(id: StoreID, traitName: string) {
    const bonuses = getTraitBonuses(id, traitName);

    const conditionals: { text: string; source: string }[] = [];
    for (const bonus of bonuses) {
        conditionals.push({ text: getBonusText(bonus), source: bonus.source})
    }

    const final = getFinalTraitValues(id, traitName)
    
    return { bonuses: final.bmap, bonusValue: final.bonus, conditionals}
}

export function getBonusText(bonus: {
    value?: number | undefined;
    type?: string | undefined;
    text: string;
    source: string;
    timestamp: number;
  }) {
    if (bonus.value) {
      const suffix = bonus.value > 0 ? 'bonus' : 'penalty';
      if (bonus.type) {
        return `${bonus.value} ${bonus.type} ${suffix} ${bonus.text}`.trim();
      } else {
        return `${bonus.value} ${suffix} ${bonus.text}`.trim();
      }
    }
  
    return `${bonus.text}`.trim();
  }


export function getFinalTraitValues(id: StoreID, traitName: string) {
    const trait = getTrait(id, traitName)
    const bonuses = getTraitBonuses(id, traitName)


    let value = 0;
    if (trait?.value) {
        value = trait.value
    }
    
    const bMap = new Map<string, { value: number; composition: { amount: number; source: string }[] }>();

    for (const bonus of bonuses) {
        if (bonus.text) {
            continue
        } else {
            const type = bonus.type ?  bonus.type.trim().toLowerCase() : 'untyped';
            const adj = (bonus.value ?? 0) >= 0 ? 'bonus' : 'penalty';
            const key = `${type} ${adj}`
            if (bMap.has(key)) {
                if (bMap.has(key)) {
                    const bMapValue = bMap.get(key)!;
                    bMap.set(key, {
                        value:
                        key==="untyped"
                         ? bMapValue.value + (bonus.value ?? 0)
                         : (adj === 'bonus' ? Math.max : Math.min)(bMapValue.value, bonus.value ?? 0),
                         composition: [...bMapValue.composition, { amount: bonus.value ?? 0, source: bonus.source}]
                    })
                }
            }
        }
    }

    const totalBonusValue = Array.from(bMap.values()).reduce((acc,bonus) => acc + bonus.value, 0);

    return {
        total: value + totalBonusValue,
        value: value,
        bonus: totalBonusValue,
        bmap: bMap,
    }
}

