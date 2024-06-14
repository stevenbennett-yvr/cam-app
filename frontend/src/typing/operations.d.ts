export type Operation =
  | OperationAdjValue
  | OperationAddBonusToValue
  | OperationSetValue
  | OperationCreateValue;

export type OperationType =
  | "adjValue"
  | "addBonusToValue"
  | "setValue"
  | "createValue";

interface OperationBase {
  readonly id: string;
  readonly type: OperationType;
  data: Record<string, any>;
}

export interface OperationAdjValue extends OperationBase {
  readonly type: "adjValue";
  data: {
    variable: string;
    value: VariableValue;
  };
}

export interface OperationAddBonusToValue extends OperationBase {
  readonly type: "addBonusToValue";
  data: {
    variable: string;
    value?: number;
    type?: string;
    text: string;
  };
}

export interface OperationSetValue extends OperationBase {
  readonly type: "setValue";
  data: {
    variable: string;
    value: VariableValue;
  };
}

export interface OperationCreateValue extends OperationBase {
  readonly type: "createValue";
  data: {
    variable: string;
    type: VariableType;
    value: VariableValue;
  };
}
