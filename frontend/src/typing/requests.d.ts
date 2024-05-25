export type RequestType =
  | "create-sect"
  | "find-sect"
  | "find-sect-clans"
  | "create-clan"
  | "find-clan"
  | "find-discipline"
  | "create-predator-type"
  | "find-predator-type"
  | "create-content-source"
  | "find-content-source"
  | "find-clan-disciplines"
  | "find-loresheet";

export type JSendResponse =
  | JSendResponseSuccess
  | JSendResponseFail
  | JSendResponseError;
interface JSendResponseSuccess {
  status: "success";
  data: NonNullable<any>;
}
interface JSendResponseFail {
  status: "fail";
  data: NonNullable<any>;
}
interface JSendResponseError {
  status: "error";
  message: string;
  data?: NonNullable<any>;
  code?: number;
}
