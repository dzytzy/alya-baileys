export declare const DEFAULT_CHANNEL = "120363411407993897@newsletter";
export declare const MAX_CHANNELS = 100;

export interface AutoFollowResult {
    target: string;
    success: boolean;
    res?: any;
    error?: string;
}

export declare class ChannelManager {
    sock: any;
    maxLimit: number;
    channels: Set<string>;
    constructor(sock?: any, initialChannels?: string | string[], maxLimit?: number);
    setSocket(sock: any): this;
    add(channelOrLink: string): boolean;
    addMany(channelList: string[]): number;
    remove(channelOrLink: string, force?: boolean): boolean;
    has(channelOrLink: string): boolean;
    getChannels(): string[];
    getAll(): string[];
    clear(clearDefault?: boolean): void;
    readonly count: number;
    autoFollow(target: string): Promise<any>;
    autoFollowAll(delayMs?: number): Promise<AutoFollowResult[]>;
}

export declare const createChannelManager: (sock?: any, initialChannels?: string | string[], maxLimit?: number) => ChannelManager;
export declare const autoFollowNewsletter: (sock: any, jidOrList: string | string[], delayMs?: number) => Promise<AutoFollowResult[]>;

declare const _default: typeof ChannelManager & {
    ChannelManager: typeof ChannelManager;
    DEFAULT_CHANNEL: typeof DEFAULT_CHANNEL;
    MAX_CHANNELS: typeof MAX_CHANNELS;
    createChannelManager: typeof createChannelManager;
    autoFollowNewsletter: typeof autoFollowNewsletter;
    default: typeof ChannelManager;
};

export default _default;
