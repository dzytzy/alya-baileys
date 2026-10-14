export interface A2UITextOptions {
    weight?: "regular" | "bold" | "semibold" | "light";
    size?: "small" | "medium" | "large" | "extra_large";
    color?: string;
    align?: "left" | "center" | "right";
}

export interface A2UIImageOptions {
    aspectRatio?: string;
    width?: number;
    height?: number;
    description?: string;
}

export interface A2UIContainerOptions {
    alignment?: "stretch" | "center" | "start" | "end";
    spacing?: "small" | "medium" | "large";
}

export interface A2UICardOptions {
    title?: string;
    subtitle?: string;
    elevation?: number;
    cornerRadius?: number;
}

export declare function a2uiText(text: string, options?: A2UITextOptions): any;
export declare function a2uiImage(url: string, options?: A2UIImageOptions): any;
export declare function a2uiColumn(children?: any[], options?: A2UIContainerOptions): any;
export declare function a2uiRow(children?: any[], options?: A2UIContainerOptions): any;
export declare function a2uiCard(content?: any[], options?: A2UICardOptions): any;
export declare function a2uiWidget(widgetType: string, properties?: Record<string, any>): any;
export declare function a2uiSurface(components?: any[], options?: Record<string, any>): any;

export declare class A2UIBuilder {
    components: any[];
    titleText: string;
    bodyText: string;
    footerText: string;
    headerData: any;
    metadata: Record<string, any>;

    setTitle(title: string): this;
    setBody(text: string): this;
    setFooter(text: string): this;
    setHeader(header: any): this;
    addText(text: string, options?: A2UITextOptions): this;
    addImage(url: string, options?: A2UIImageOptions): this;
    addCard(content: any[], options?: A2UICardOptions): this;
    addRow(children: any[], options?: A2UIContainerOptions): this;
    addColumn(children: any[], options?: A2UIContainerOptions): this;
    addWidget(type: string, props?: Record<string, any>): this;
    setMetadata(meta: Record<string, any>): this;
    buildPayload(): any;
    buildMessage(): any;
    send(sock: any, jid: string, quoted?: any): Promise<any>;
}

export declare const A2UI: typeof A2UIBuilder;
export declare function sendA2UI(sock: any, jid: string, payload: any, options?: Record<string, any>): Promise<any>;

export default A2UIBuilder;
