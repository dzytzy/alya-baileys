export interface Theme {
    name: string;
    start: [number, number, number];
    mid: [number, number, number];
    end: [number, number, number];
}

export declare const THEMES: Theme[];
export declare const BANNER_ART: string[];
export declare function printAlyaBanner(force?: boolean): void;

declare const _default: {
    printAlyaBanner: typeof printAlyaBanner;
    THEMES: typeof THEMES;
    BANNER_ART: typeof BANNER_ART;
};

export default _default;
