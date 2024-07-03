export type StoreID = 'CHARACTER' | string;
export type VariableStore = {
  variables: Record<string, Variable>;
  bonuses: Record<string, { value?: number; type?: string; text: string; source: string; timestamp: number }[]>;
  history: Record<string, { to: VariableValue; from: VariableValue | null; source: string; timestamp: number }[]>;
};

export type Variable = VariableNum | VariableStr | VariableBool | VariableListStr;
export type VariableType = 'num' | 'str' | 'bool' | 'list-str';
export type VariableValue = number | string | boolean | string[];

interface VariableBase {
  name: string;
  type: VariableType;
  value: VariableValue;
}

export interface VariableNum extends VariableBase {
  type: 'num';
  value: number;
}

export interface VariableStr extends VariableBase {
  type: 'str';
  value: string;
}

export interface VariableBool extends VariableBase {
  type: 'bool';
  value: boolean;
}

export interface VariableListStr extends VariableBase {
  type: 'list-str';
  value: string[];
}
