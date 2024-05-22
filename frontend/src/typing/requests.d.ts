export type RequestType =
  | "create-sect"
  | "find-sect"
  | "create-clan"
  | "find-clan"
  | "create-predator-type"
  | "find-predator-type"
  | "create-content-source"
  | "find-content-source";

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
