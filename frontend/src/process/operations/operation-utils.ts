import { fetchContentAll } from "@content/content-store";
import { ContentType, Entity } from "@typing/content";
import {
  Operation,
  OperationAddBonusToValue,
  OperationAdjValue,
  OperationCreateValue,
  OperationSetValue,
  OperationType,
} from "@typing/operations";
import { StoreID, TraitType } from "@typing/traits";

export function createDefaultOperation<T = Operation>(type: OperationType): T {
  if (type === "adjValue") {
    return {
      id: crypto.randomUUID(),
      type: type,
      data: {
        variable: "",
        value: 0,
      },
    } satisfies OperationAdjValue as T;
  } else if (type === "addBonusToValue") {
    return {
      id: crypto.randomUUID(),
      type: type,
      data: {
        variable: "",
        value: undefined,
        type: undefined,
        text: "",
      },
    } satisfies OperationAddBonusToValue as T;
  } else if (type === "setValue") {
    return {
      id: crypto.randomUUID(),
      type: type,
      data: {
        variable: "",
        value: false,
      },
    } satisfies OperationSetValue as T;
  } else if (type === "createValue") {
    return {
      id: crypto.randomUUID(),
      type: type,
      data: {
        variable: "",
        value: "",
        type: "str",
      },
    } satisfies OperationCreateValue as T;
  } else {
    throw new Error(`Unknown operation type: ${type}`);
  }
}

export interface ObjectWithUUID {
  [key: string]: any;
  _select_uuid: string;
  _content_type: ContentType;
  _meta_data?: Record<string, any>;
}