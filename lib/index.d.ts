import socket from "./Socket";

export * from "./Builder";
export * from "./Telegram";
export * from "./Utils/banner";

export * from "./Socket";
export * from "./Utils";
export * from "./Types";
export * from "./Store";
export * from "./Defaults";
export * from "./WABinary";
export * from "./WAM";
export * from "./WAUSync";

export { proto } from "../WAProto";

export declare const makeWASocket: typeof socket;
export default socket;
