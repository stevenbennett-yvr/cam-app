import { StoreID } from "@typing/variables";
import { ObjectWithUUID } from "./operation-utils";
import {
  Operation,
  OperationAddBonusToValue,
  OperationAdjValue,
  OperationCreateValue,
  OperationGiveBackground,
  OperationRemoveBackground,
  OperationSetValue,
} from "@typing/operations";
import { addVariable, addVariableBonus, adjVariable, getVariable, setVariable } from "@variables/variable-manager";
import { fetchContentById } from "@content/content-store";
import { Background } from "@typing/content";
import { displayError } from "@utils/notifications";


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
    
    // Value creation
    if (options?.doOnlyValueCreation) {
      if (operation.type === "createValue") {
        return await runCreateValue(varId, operation, sourceLabel);
      }
      return null;
    }

    // Normal
    if (operation.type === "adjValue") {
      return await runAdjValue(varId, operation, sourceLabel);
    } else if (operation.type === "setValue") {
      return await runSetValue(varId, operation, sourceLabel);
    } else if (operation.type === "addBonusToValue") {
      return await runAddBonusToValue(varId, operation, sourceLabel);
    } else if (operation.type === "giveBackground") {
      return await runGiveBackground(varId, operation, sourceLabel);
    } else if (operation.type === "removeBackground") {
      return await runRemoveBackground(varId, operation, sourceLabel);
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
  addVariable(varId, operation.data.type, operation.data.variable, operation.data.value, sourceLabel);
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
  setVariable(varId, operation.data.variable, operation.data.value, sourceLabel);
  return null;
}

async function runAddBonusToValue(
  varId: StoreID,
  operation: OperationAddBonusToValue,
  sourceLabel?: string,
): Promise<OperationResult> {
  addVariableBonus(
    varId,
    operation.data.variable,
    operation.data.value,
    operation.data.type,
    operation.data.text,
    sourceLabel ?? 'Unknown'
  );
  return null;
}

async function runGiveBackground(
  varId: StoreID,
  operation: OperationGiveBackground,
  sourceLabel?: string
): Promise<OperationResult> {
  if (operation.data.backgroundId === -1 ) return null;
  const background = await fetchContentById<Background>('background', operation.data.backgroundId);
  if (!background) {
    displayError(`Background not found; ${operation.data.backgroundId}`, true)
    return null
  }

  adjVariable(varId, 'BACKGROUND_IDS', `${background.id}`, sourceLabel);

  return null;
}

async function runRemoveBackground(
  varId: StoreID,
  operation: OperationRemoveBackground,
  sourceLabel?: string
): Promise<OperationResult> {
  if (operation.data.backgroundId === -1) return null;
  const background = await fetchContentById<Background>('background', operation.data.backgroundId);
  if (!background) {
    displayError('Background not found', true);
    return null
  }

  const getVariableList = (variableName: string) => {
    return (getVariable(varId, variableName)?.value ?? []) as string[];
  };

  setVariable(
    varId,
    'BACKGROUND_IDS',
    getVariableList('BACKGROUND_IDS').filter((id) => id !== `${background.id}`),
    sourceLabel
  );
  return null;
}