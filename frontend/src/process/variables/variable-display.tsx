import {
    StoreID,
    VariableNum,
} from '@typing/variables';
import { getVariable, getVariableBonuses } from './variable-manager';
import { sign } from '@utils/numbers';
import { Text } from '@mantine/core';

export function displayFinalVariableValue(id: StoreID, variableName: string) {
    const finalData = getFinalVariableValue(id, variableName);
    const breakdown = getVariableBreakdown(id, variableName);

    return (
        <span style={{ position: 'relative' }}>
            {<>{finalData.total}</>}
            {breakdown.conditionals.length > 0 ? (
                <Text
                    c='guide.5'
                    style={{
                        position: 'absolute',
                        top: -6,
                        right: -7,
                    }}
                >
                    *
                </Text>
            ) : null}
        </span>
    );
}

export function getFinalVariableValue(id: StoreID, variableName: string) {
    const variable = getVariable(id, variableName);
    const bonuses = getVariableBonuses(id, variableName);

    let value = 0;
    if (variable?.type === 'num') {
        value = variable.value;
    }

    const bMap = new Map<string, { value: number; composition: { amount: number; source: string }[] }>();
    /*
      If there's no display text, we add the number and compare against type.
      If there's display text, we don't add the value.
  
      If there's no type, we add the number either way.
    */
    for (const bonus of bonuses) {
        if (bonus.text) {
            continue;
        } else {
            const type = bonus.type ? bonus.type.trim().toLowerCase() : 'untyped';
            const adj = (bonus.value ?? 0) >= 0 ? 'bonus' : 'penalty';
            const key = `${type} ${adj}`;
            if (bMap.has(key)) {
                const bMapValue = bMap.get(key)!;
                bMap.set(key, {
                    value:
                        key === 'untyped'
                            ? bMapValue.value + (bonus.value ?? 0)
                            : (adj === 'bonus' ? Math.max : Math.min)(bMapValue.value, bonus.value ?? 0),
                    composition: [...bMapValue.composition, { amount: bonus.value ?? 0, source: bonus.source }],
                });
            } else {
                bMap.set(key, {
                    value: bonus.value!,
                    composition: [{ amount: bonus.value!, source: bonus.source }],
                });
            }
        }
    }

    const totalBonusValue = Array.from(bMap.values()).reduce((acc, bonus) => acc + bonus.value, 0);

    return {
        total: value + totalBonusValue,
        value: value,
        bonus: totalBonusValue,
        bmap: bMap,
    };
}

export function getVariableBreakdown(id: StoreID, variableName: string) {
    const bonuses = getVariableBonuses(id, variableName);

    const conditionals: { text: string; source: string }[] = [];
    for (const bonus of bonuses) {
        if (bonus.text) {
            conditionals.push({ text: getBonusText(bonus), source: bonus.source });
        }
    }

    const final = getFinalVariableValue(id, variableName);

    return { bonuses: final.bmap, bonusValue: final.bonus, conditionals };
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
            return `${sign(bonus.value)} ${bonus.type} ${suffix} ${bonus.text}`.trim();
        } else {
            return `${sign(bonus.value)} ${suffix} ${bonus.text}`.trim();
        }
    }

    return `${bonus.text}`.trim();
}

export function getHealthValueParts(id: StoreID) {
    const ancestryHp = getFinalVariableValue(id, 'MAX_HEALTH_ANCESTRY').total;
    const classHp = getFinalVariableValue(id, 'MAX_HEALTH_CLASS_PER_LEVEL').total;
    const bonusHp = getFinalVariableValue(id, 'MAX_HEALTH_BONUS').total;
    const conMod = getFinalVariableValue(id, 'ATTRIBUTE_CON').total;
    const level = getVariable<VariableNum>(id, 'LEVEL')!.value;

    const breakdown = getVariableBreakdown(id, 'MAX_HEALTH_BONUS');
    // const ancestryBreakdown = getVariableBreakdown(id, 'MAX_HEALTH_ANCESTRY');
    // const classBreakdown = getVariableBreakdown(id, 'MAX_HEALTH_CLASS_PER_LEVEL');

    return {
        level,
        ancestryHp,
        classHp,
        bonusHp,
        conMod,
        breakdown,
        // ancestryBreakdown,
        // classBreakdown,
    };
}

export function getFinalHealthValue(id: StoreID) {
    const { level, ancestryHp, classHp, bonusHp, conMod } = getHealthValueParts(id);
    return ancestryHp + bonusHp + (classHp + conMod) * level;
}

export function displayFinalHealthValue(id: StoreID) {
    return <span>{getFinalHealthValue(id)}</span>;
}

