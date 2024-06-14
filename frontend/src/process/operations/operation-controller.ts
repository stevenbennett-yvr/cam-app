import { Operation } from "@typing/operations";
import { StoreID } from "@typing/traits";
import {
  OperationOptions,
  OperationResult,
  runOperations,
} from "./operation-runner";
import * as _ from "lodash-es";
import { ContentPackage, ContentSource, Kindred } from "@typing/content";
import { resetTraits } from "../traits/trait-manager";

async function executeOperations(
  varId: StoreID,
  primarySource: string,
  operations: Operation[],
  options?: OperationOptions,
  sourceLabel?: string,
) {
  let result = await runOperations(
    varId,
    operations,
    _.cloneDeep(options),
    sourceLabel,
  );

  return result;
}

export async function executeCharacterOperations(
  kindred: Kindred,
) {
  resetTraits("CHARACTER");

  const operationsPassthrough = async (options?: OperationOptions) => {
    let contentSourceResults: {
      baseSource: ContentSource;
      baseResults: OperationResult[];
    }[] = [];

    let characterResults = await executeOperations(
      "CHARACTER",
      "character",
      kindred.operations
        ? kindred.operations ?? []
        : [],
      options,
      "Custom",
    );


    return {
      contentSourceResults,
      characterResults,
    };
  };

  // Value creation round //
  await operationsPassthrough({ doOnlyValueCreation: true });
  // define values for any weapons or lores

  // Normal round //
  const results = await operationsPassthrough();

  return results
}
