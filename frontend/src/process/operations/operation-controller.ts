import { Operation } from "@typing/operations";
import { StoreID } from "@typing/variables";
import {
  OperationOptions,
  OperationResult,
  runOperations,
} from "./operation-runner";
import * as _ from "lodash-es";
import { ContentPackage, ContentSource, Kindred } from "@typing/content";
import { resetVariables, addVariable, adjVariable } from "@variables/variable-manager";
import { newVariable } from "@variables/variable-utils";

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
  content: ContentPackage,
  context: string,
) {
  resetVariables("CHARACTER");

  const clanDisciplines = content.clan_disciplines.filter((d) => d.clan_id === kindred.details?.clanID)

  const operationsPassthrough = async (options?: OperationOptions) => {
    let contentSourceResults: {
      baseSource: ContentSource;
      baseResults: OperationResult[];
    }[] = [];

    if (clanDisciplines && kindred.details?.clanID !== 16) {
      clanDisciplines.forEach((ref) => {
        const foundDiscipline = content.disciplines.find((d) => d.id === ref.discipline_id);
        if (foundDiscipline) {
          const disciplineId = foundDiscipline.id;
          if (disciplineId) {
            adjVariable("CHARACTER", "DISCIPLINE_IDS", `${disciplineId}`, "In Clan Discipline")}
            addVariable("CHARACTER", "num", `DISCIPLINE_INCLAN_${foundDiscipline.name.toLocaleUpperCase()}`, 0)
        }
      });
    }
    
    let clanResults = await executeOperations(
      "CHARACTER",
      "clan",
      kindred.clanOperations
        ? kindred.clanOperations ?? [] : [],
      options,
      "Clan"
    )

    let characterResults = await executeOperations(
      "CHARACTER",
      "character",
      kindred.operations
        ? kindred.operations ?? []
        : [],
      options,
      "Miscellaneous",
    );


    return {
      contentSourceResults,
      characterResults,
      clanResults,
    };
  };

  // Value creation round //
  await operationsPassthrough({ doOnlyValueCreation: true });
  // define values for any weapons or lores

  // Normal round //
  const results = await operationsPassthrough();

  return results
}
