import { Readable } from "stream";
import { ChannelManager, createChannelManager, autoFollowNewsletter, DEFAULT_CHANNEL, MAX_CHANNELS } from "../Utils/channel-manager";

export { ChannelManager, createChannelManager, autoFollowNewsletter, DEFAULT_CHANNEL, MAX_CHANNELS };

export declare function formatJid(jid: string): string;
export declare function isJidGroup(jid: string): boolean;
export declare function isJidUser(jid: string): boolean;
export declare function isJidBroadcast(jid: string): boolean;
export declare function isJidNewsletter(jid: string): boolean;
export declare function isJidStatus(jid: string): boolean;
export declare function jidToPhone(jid: string): string;
export declare function phoneToJid(phone: string): string;
export declare function sleep(ms: number): Promise<void>;
export declare function retry<T>(fn: (attempt: number) => Promise<T>, retries?: number, delayMs?: number): Promise<T>;
export declare function extractMessageText(message: any): string;
export declare function extractMessageMedia(message: any): { type: string; media: any } | null;
export declare function bufferToStream(buffer: Buffer): Readable;
export declare function streamToBuffer(stream: Readable | AsyncIterable<any>): Promise<Buffer>;
export declare function formatBytes(bytes: number, decimals?: number): string;
export declare function formatDuration(seconds: number): string;
export declare function generateId(prefix?: string): string;
export declare function downloadMedia(message: any, options?: Record<string, any>): Promise<Buffer>;

export declare const Toolkit: {
    formatJid: typeof formatJid;
    isJidGroup: typeof isJidGroup;
    isJidUser: typeof isJidUser;
    isJidBroadcast: typeof isJidBroadcast;
    isJidNewsletter: typeof isJidNewsletter;
    isJidStatus: typeof isJidStatus;
    jidToPhone: typeof jidToPhone;
    phoneToJid: typeof phoneToJid;
    sleep: typeof sleep;
    retry: typeof retry;
    extractMessageText: typeof extractMessageText;
    extractMessageMedia: typeof extractMessageMedia;
    bufferToStream: typeof bufferToStream;
    streamToBuffer: typeof streamToBuffer;
    formatBytes: typeof formatBytes;
    formatDuration: typeof formatDuration;
    generateId: typeof generateId;
    downloadMedia: typeof downloadMedia;
    ChannelManager: typeof ChannelManager;
    createChannelManager: typeof createChannelManager;
    autoFollowNewsletter: typeof autoFollowNewsletter;
    DEFAULT_CHANNEL: typeof DEFAULT_CHANNEL;
};

export default Toolkit;
