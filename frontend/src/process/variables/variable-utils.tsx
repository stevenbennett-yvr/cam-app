import { StoreID, Variable, VariableBool, VariableListStr, VariableNum, VariableStr, VariableType, VariableValue } from "@typing/variables";
import { throwError } from "@utils/notifications";
import { toLabel } from "@utils/to-label";
import * as _ from 'lodash-es'
import { getVariables } from "./variable-manager";

export function newVariable(type: VariableType, name: string, defaultValue?: VariableValue): Variable {
    if (type === "num") {
        return {
            name,
            type,
            value: _.isNumber(defaultValue) ? defaultValue : 0,
        } satisfies VariableNum;
    }
    if (type === 'str') {
        return {
            name,
            type,
            value: _.isString(defaultValue) ? defaultValue : '',
        } satisfies VariableStr
    }
    if (type === 'bool') {
        return {
            name,
            type,
            value: _.isBoolean(defaultValue) ? defaultValue : false,
        } satisfies VariableBool
    }
    if (type === 'list-str') {
        return {
            name,
            type,
            value: isListStr(defaultValue) ? defaultValue : [],
        } satisfies VariableListStr;
    }
    throwError(`Invalid variable type: ${type}`);
    return {} as Variable;
}


export function variableToLabel(variable: Variable) {
    return toLabel(variable.name);
}

export function labelToVariable(label: string, trim = true) {
    if (trim) {
        label = label.trim();
    }
    let cleanedString = label
        .toUpperCase()
        .replace(/-/g, '_')
        .replace(/[^a-zA-Z_\s]/g, '');
    cleanedString = cleanedString.replace(/\s+/g, '_');
    return cleanedString;
}

export function isListStr(value?: any): value is string[] {
    if (_.isString(value)) {
        try {
            value = JSON.parse(value);
        } catch (e) {
            value = null;
        }
    }
    return Array.isArray(value) && value.every((v) => _.isString(v));
}

export function findVariable<T = Variable>(id: StoreID, type: VariableType, label: string): T | null {
    const VAR_FORMATTED = labelToVariable(label);
    const variable = Object.values(getVariables(id)).find(
        (variable) =>
            variable.type === type && (variable.name === VAR_FORMATTED || variable.name.endsWith(`_${VAR_FORMATTED}`))
    );
    return (variable ?? null) as T | null;
}
export function isVariableNum(value: Variable | any): value is VariableNum {
    return (value as VariableNum).type === 'num';
}
export function isVariableStr(value: Variable | any): value is VariableStr {
    return (value as VariableStr).type === 'str';
}
export function isVariableBool(value: Variable | any): value is VariableBool {
    return (value as VariableBool).type === 'bool';
}
export function isVariableListStr(value: Variable | any): value is VariableListStr {
    return (value as VariableListStr).type === 'list-str';
}