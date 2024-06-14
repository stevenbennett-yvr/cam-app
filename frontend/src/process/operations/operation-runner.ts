import { StoreID } from "@typing/traits";
import { ObjectWithUUID } from "./operation-utils";
import {
  Operation,
  OperationAddBonusToValue,
  OperationAdjValue,
  OperationCreateValue,
  OperationSetValue,
} from "@typing/operations";
import {
  addTrait,
  addTraitBonus,
  adjVariable,
  setTrait,
} from "../traits/trait-manager";
import { result } from "lodash-es";

export type OperationOptions = {
  doOnlyValueCreation?: boolean;
  doConditionals?: boolean;
  doOnlyConditionals?: boolean;
  onlyConditionalsWhitelist?: string[];
};

export type OperationResult = {
  selection?: {
    id: string;
    title?: string;
    description?: string;
    options: ObjectWithUUID[];
  };
  result?: {
    source?: ObjectWithUUID;
    results: OperationResult[];
  };
} | null;

export async function runOperations(
  varId: StoreID,
  operations: Operation[],
  options?: OperationOptions,
  sourceLabel?: string,
): Promise<OperationResult[]> {
  const runOp = async (operation: Operation): Promise<OperationResult> => {
    if (options?.doOnlyValueCreation) {
      if (operation.type === "createValue") {
        return await runCreateValue(varId, operation, sourceLabel);
      }
      return null;
    }
    if (operation.type === "adjValue") {
      return await runAdjValue(varId, operation, sourceLabel);
    } else if (operation.type === "setValue") {
      return await runSetValue(varId, operation, sourceLabel);
    } else if (operation.type === "addBonusToValue") {
      return await runAddBonusToValue(varId, operation, sourceLabel);
    }
    return null;
  };

  const results: OperationResult[] = [];
  for (const operation of operations) {
    results.push(await runOp(operation));
  }

  return results;
}

async function runCreateValue(
  varId: StoreID,
  operation: OperationCreateValue,
  sourceLabel?: string,
): Promise<OperationResult> {
  addTrait(
    varId,
    operation.data.type,
    operation.data.variable,
    operation.data.value,
    sourceLabel,
  );
  return null;
}

async function runAdjValue(
  varId: StoreID,
  operation: OperationAdjValue,
  sourceLabel?: string,
): Promise<OperationResult> {
  // Not a skill adjustment nor a character is proficient in the skill
  adjVariable(
    varId,
    operation.data.variable,
    operation.data.value,
    sourceLabel,
  );
  return null;
}

async function runSetValue(
  varId: StoreID,
  operation: OperationSetValue,
  sourceLabel?: string,
): Promise<OperationResult> {
  setTrait(varId, operation.data.variable, operation.data.value, sourceLabel);
  return null;
}

async function runAddBonusToValue(
  varId: StoreID,
  operation: OperationAddBonusToValue,
  sourceLabel?: string,
): Promise<OperationResult> {
  addTraitBonus(
    varId,
    operation.data.variable,
    operation.data.value,
    operation.data.type,
    operation.data.text,
    sourceLabel ?? "Unknown",
  );
  return null;
}
