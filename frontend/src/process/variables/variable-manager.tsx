import { Variable, VariableListStr, VariableNum, VariableStore, VariableType, VariableValue } from "@typing/variables"
import { isListStr, isVariableBool, isVariableListStr, isVariableNum, isVariableStr, newVariable } from "./variable-utils"
import { StoreID } from "@typing/variables";
import * as _ from 'lodash-es'
import { throwError } from "@utils/notifications";
import { extractNumber } from "@utils/numbers";

export const DEFAULT_VARIABLES: Record<string, Variable> = {

    /* Attributes */
    ATTRIBUTE_PHYSICAL_STRENGTH: newVariable(
        "num", "ATTRIBUTE_PHYSICAL_STRENGTH", 1
    ),
    ATTRIBUTE_PHYSICAL_DEXTERITY: newVariable(
        "num", "ATTRIBUTE_PHYSICAL_DEXTERITY", 1
    ),
    ATTRIBUTE_PHYSICAL_STAMINA: newVariable(
        "num", "ATTRIBUTE_PHYSICAL_STAMINA", 1
    ),
    ATTRIBUTE_SOCIAL_CHARISMA: newVariable(
        "num", "ATTRIBUTE_SOCIAL_CHARISMA", 1
    ),
    ATTRIBUTE_SOCIAL_MANIPULATION: newVariable(
        "num", "ATTRIBUTE_SOCIAL_MANIPULATION", 1
    ),
    ATTRIBUTE_SOCIAL_COMPOSURE: newVariable(
        "num", "ATTRIBUTE_SOCIAL_COMPOSURE", 1
    ),
    ATTRIBUTE_MENTAL_INTELLIGENCE: newVariable(
        "num", "ATTRIBUTE_MENTAL_INTELLIGENCE", 1
    ),
    ATTRIBUTE_MENTAL_WITS: newVariable(
        "num", "ATTRIBUTE_MENTAL_WITS", 1
    ),
    ATTRIBUTE_MENTAL_RESOLVE: newVariable(
        "num", "ATTRIBUTE_MENTAL_RESOLVE", 1
    ),

    /* nums */
    SKILL_PHYSICAL_ATHLETICS: newVariable(
        "num", "SKILL_PHYSICAL_ATHLETICS"
    ),
    SKILL_PHYSICAL_BRAWL: newVariable(
        "num", "SKILL_PHYSICAL_BRAWL"
    ),
    SKILL_PHYSICAL_CRAFT: newVariable(
        "num", "SKILL_PHYSICAL_CRAFT"
    ),
    SKILL_PHYSICAL_DRIVING: newVariable(
        "num", "SKILL_PHYSICAL_DRIVING"
    ),
    SKILL_PHYSICAL_MARKSMANSHIP: newVariable(
        "num", "SKILL_PHYSICAL_MARKSMANSHIP"
    ),
    SKILL_PHYSICAL_LARCENY: newVariable(
        "num", "SKILL_PHYSICAL_LARCENY"
    ),
    SKILL_PHYSICAL_MELEE: newVariable(
        "num", "SKILL_PHYSICAL_MELEE"
    ),
    SKILL_PHYSICAL_STEALTH: newVariable(
        "num", "SKILL_PHYSICAL_STEALTH"
    ),
    SKILL_PHYSICAL_SURVIVAL: newVariable(
        "num", "SKILL_PHYSICAL_SURVIVAL"
    ),
    SKILL_SOCIAL_ANIMAL_KEN: newVariable(
        "num", "SKILL_SOCIAL_ANIMAL_KEN"
    ),
    SKILL_SOCIAL_ETIQUETTE: newVariable(
        "num", "SKILL_SOCIAL_ETIQUETTE"
    ),
    SKILL_SOCIAL_INSIGHT: newVariable(
        "num", "SKILL_SOCIAL_INSIGHT"
    ),
    SKILL_SOCIAL_INTIMIDATION: newVariable(
        "num", "SKILL_SOCIAL_INTIMIDATION"
    ),
    SKILL_SOCIAL_LEADERSHIP: newVariable(
        "num", "SKILL_SOCIAL_LEADERSHIP"
    ),
    SKILL_SOCIAL_PERFORMANCE: newVariable(
        "num", "SKILL_SOCIAL_PERFORMANCE"
    ),
    SKILL_SOCIAL_PERSUASION: newVariable(
        "num", "SKILL_SOCIAL_PERSUASION"
    ),
    SKILL_SOCIAL_STREETWISE: newVariable(
        "num", "SKILL_SOCIAL_STREETWISE"
    ),
    SKILL_SOCIAL_SUBTERFUGE: newVariable(
        "num", "SKILL_SOCIAL_SUBTERFUGE"
    ),
    SKILL_MENTAL_ACADEMICS: newVariable(
        "num", "SKILL_MENTAL_ACADEMICS"
    ),
    SKILL_MENTAL_AWARENESS: newVariable(
        "num", "SKILL_MENTAL_AWARENESS"
    ),
    SKILL_MENTAL_FINANCE: newVariable(
        "num", "SKILL_MENTAL_FINANCE"
    ),
    SKILL_MENTAL_INVESTIGATION: newVariable(
        "num", "SKILL_MENTAL_INVESTIGATION"
    ),
    SKILL_MENTAL_MEDICINE: newVariable(
        "num", "SKILL_MENTAL_MEDICINE"
    ),
    SKILL_MENTAL_OCCULT: newVariable(
        "num", "SKILL_MENTAL_OCCULT"
    ),
    SKILL_MENTAL_POLITICS: newVariable(
        "num", "SKILL_MENTAL_POLITICS"
    ),
    SKILL_MENTAL_SCIENCE: newVariable(
        "num", "SKILL_MENTAL_SCIENCE"
    ),
    SKILL_MENTAL_TECHNOLOGY: newVariable(
        "num", "SKILL_MENTAL_TECHNOLOGY"
    ),

    HEALTH_LEVELS: newVariable(
        "num", "HEALTH_LEVELS", 3
    ),

    WILLPOWER: newVariable(
        "num", "WILLPOWER"
    ),

    INITIATIVE: newVariable(
        "num", "INITIATIVE"
    ),

    MOVEMENT: newVariable(
        "num", "MOVEMENT", 3
    ),

    SECT_ID: newVariable(
        "num", "SECT_ID"
    ),

    CLAN_ID: newVariable(
        "num", "CLAN_ID"
    ),

    PREDATOR_TYPE_ID: newVariable(
        "num", "PREDATOR_TYPE_ID"
    ),

    LORESHEET_ID: newVariable(
        "num", "LORESHEET_ID"
    ),

    LORESHEET_BENEFIT_IDS: newVariable(
        "list-str", "LORESHEET_BENEFIT_IDS"
    ),

    BACKGROUND_IDS: newVariable(
        "list-str", "BACKGROUNDS_IDS"
    ),

    BACKGROUND_BENEFIT_IDS: newVariable(
        "list-str", "BACKGROUND_BENEFIT_IDS"
    ),

    MERIT_FLAW_IDS: newVariable(
        "list-str", "MERITS_FLAWS_IDS"
    ),

    DISCIPLINE_IDS: newVariable(
        "list-str", "DISCIPLINE_IDS"
    ),

    POWER_DATAS: newVariable(
        "list-str", "POWER_DATAS"
    ),
}

const variableMap = new Map<string, VariableStore>()


export function getVariableStore(id: StoreID) {
    if (!variableMap.has(id)) {
        variableMap.set(id, {
            variables: _.cloneDeep(DEFAULT_VARIABLES),
            bonuses: {},
            history: {},
        });
    }
    return variableMap.get(id)!;
}

export function getVariables(id: StoreID) {
    return getVariableStore(id).variables;
}

export function getVariable<T = Variable>(id: StoreID, name: string): T | null {
    return _.cloneDeep(getVariables(id)[name]) as T | null;
}

export function getVariableBonuses(id: StoreID, name: string) {
    return _.cloneDeep(getVariableStore(id).bonuses[name]) ?? [];
}

export function addVariableBonus(
    id: StoreID,
    name: string,
    value: number | undefined,
    type: string | undefined,
    text: string,
    source: string
) {
    if (!getVariableStore(id).bonuses[name]) {
        getVariableStore(id).bonuses[name] = [];
    }

    // If there's already a bonus with the same value, type, text, and source, don't add it
    if (
        getVariableStore(id).bonuses[name].some(
            (bonus) => bonus.value === value && bonus.type === type && bonus.text === text && bonus.source === source
        )
    ) {
        return;
    }

    getVariableStore(id).bonuses[name].push({
        value,
        type,
        text,
        source,
        timestamp: Date.now(),
    });
}

export function getVariableHistory(id: StoreID, name: string) {
    return _.cloneDeep(getVariableStore(id).history[name]) ?? [];
}

function addVariableHistory(id: StoreID, name: string, to: VariableValue, from: VariableValue, source: string) {
    if (_.isEqual(from, to)) return;
    if (!getVariableStore(id).history[name]) {
        getVariableStore(id).history[name] = [];
    }
    getVariableStore(id).history[name].push({
        to: _.cloneDeep(to),
        from: _.cloneDeep(from),
        source,
        timestamp: Date.now(),
    });
}


export function addVariable(
    id: StoreID,
    type: VariableType,
    name: string,
    defaultValue?: VariableValue,
    source?: string
) {
    let variable = getVariables(id)[name];
    if (variable) {
        // Already exists
        if (defaultValue) {
            adjVariable(id, name, defaultValue, source);
        }
    } else {
        // New variable
        variable = newVariable(type, name, defaultValue);
        getVariables(id)[variable.name] = variable;

        // Add to history
        //addVariableHistory(variable.name, variable.value, null, source ?? 'Created');
    }
    return _.cloneDeep(variable);
}

export function removeVariable(id: StoreID, name: string) {
    delete getVariables(id)[name];
}

export function resetVariables(id?: StoreID) {
    if (id) {
        variableMap.delete(id);
    } else {
        variableMap.clear();
    }
}

export function setVariable(id: StoreID, name: string, value: VariableValue, source?: string) {
    let variable = getVariables(id)[name];
    if (!variable) {
        throwError(`Invalid variable name: ${name}`);
    }
    const oldValue = _.cloneDeep(variable.value);

    if (!variable) throwError(`Invalid variable name: ${name}`);
    if (isVariableNum(variable) && _.isNumber(value)) {
        variable.value = value
    } else if (isVariableStr(variable) && _.isString(value)) {
        variable.value = value;
    } else if (isVariableBool(variable) && _.isBoolean(value)) {
        variable.value = value;
    } else if (isVariableListStr(variable) && isListStr(value)) {
        if (_.isString(value)) {
            value = JSON.parse(value);
        }
        variable.value = _.uniq(value as string[]);
    } else {
        throwError(`Invalid value for variable: ${name}, ${value}`);
    }

    // Add to history
    addVariableHistory(id, variable.name, variable.value, oldValue, source ?? 'Updated');
}

export function adjVariable(id: StoreID, name: string, amount: VariableValue, source?: string) {
    let variable = getVariables(id)[name];
    if (!variable) {
        throwError(`Invalid variable name: ${name}`);
    }
    const oldValue = _.cloneDeep(variable.value);

    if (!variable) throwError(`Invalid variable name: ${name}`);
    if (isVariableNum(variable) && _.isNumber(+amount)) {
        variable.value += parseInt(`${amount}`);
    } else if (isVariableStr(variable) && _.isString(amount)) {
        variable.value += amount;
    } else if (isVariableBool(variable) && _.isBoolean(amount)) {
        variable.value = amount ? true : variable.value;
    } else if (isVariableListStr(variable) && _.isString(amount)) {
        variable.value = _.uniq([...variable.value, amount]);
    } else {
        throwError(`Invalid adjust amount for variable: ${name}, ${JSON.stringify(amount)}`);
    }

    // Add to history
    addVariableHistory(id, variable.name, variable.value, oldValue, source ?? 'Adjusted');
}



export function getAllAttributeVariables(id: StoreID): VariableNum[] {
    const variables = [];
    for (const variable of Object.values(getVariables(id))) {
        if (variable.name.startsWith('ATTRIBUTE_') && variable.type === 'num') {
            variables.push(variable);
        }
    }
    return (variables as VariableNum[]).sort((a, b) => a.name.localeCompare(b.name));
}

export function getAllSkillVariables(id: StoreID): VariableNum[] {
    const variables = [];
    for (const variable of Object.values(getVariables(id))) {
        if (variable.name.startsWith('SKILL_') && variable.type === 'num') {
            variables.push(variable);
        }
    }
    return (variables as VariableNum[]).sort((a, b) => a.name.localeCompare(b.name));
}

export function getAllDisciplines(id: StoreID): VariableNum[] {
    const variables = [];
    for (const variable of Object.values(getVariables(id))) {
        if (variable.name.startsWith('DISCIPLINE_') && variable.type === 'num') {
            variables.push(variable);
        }
    }
    return (variables as VariableNum[]).sort((a, b) => a.name.localeCompare(b.name));
}

export function getAllDisciplineIds(id: StoreID): number[] {
    const variables: number[] = [];
    const disciplineIds = getVariable(id, "DISCIPLINE_IDS") as VariableListStr;
    disciplineIds.value.map(id => variables.push(parseInt(id.trim(), 10)))
    
    return variables
}