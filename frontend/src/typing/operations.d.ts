import {
  Variable,
  VariableType,
  VariableValue,
} from './variables'
import {
  ContentSource, ContentType
} from './content'
import {
  OperationResult
} from './../process/operations/operation-runner'


export type Operation =
  | OperationAdjValue
  | OperationAddBonusToValue
  | OperationSetValue
  | OperationCreateValue
  | OperationGiveBackground
  | OperationRemoveBackground
  // Background Advantage
  | OperationGiveMeritFlaw
  | OperatoinGivePower


export type OperationType =
  | "adjValue"
  | "addBonusToValue"
  | "setValue"
  | "createValue"
  | "giveBackground"
  | "removeBackground"
  // Background Advantage
  | "giveMeritFlaw"
  | "givePower"
  ;

interface OperationBase {
  id: string;
  type: OperationType;
  data: Record<string, any>;
}

export interface OperationAdjValue extends OperationBase {
  type: "adjValue";
  data: {
    variable: string;
    value: VariableValue;
  };
}

export interface OperationAddBonusToValue extends OperationBase {
  type: "addBonusToValue";
  data: {
    variable: string;
    value?: number;
    type?: string;
    text: string;
  };
}

export interface OperationSetValue extends OperationBase {
  type: "setValue";
  data: {
    variable: string;
    value: VariableValue;
  };
}

export interface OperationCreateValue extends OperationBase {
   type: "createValue";
  data: {
    variable: string;
    type: VariableType;
    value: VariableValue;
  };
}

export interface OperationGiveBackground extends OperationBase {
  type: "giveBackground";
  data: {
    backgroundId: id;
  }
}

export interface OperationRemoveBackground extends OperationBase {
  type: "removeBackground";
  data: {
    backgroundId: number;
  }
}

export interface OperationGiveMeritFlaw extends OperationBase {
  type: "giveMeritFlaw";
  data: {
    meritFlawId: number;
  }
}

export type PowerMetadata = {
  type: "POWER" | "FORMULA" | "RITUAL" | "CEREMONY";
  powerId: number;
}

export interface OperatoinGivePower extends OperationBase {
  readonly type: 'givePower';
  data: PowerMetadata;
}