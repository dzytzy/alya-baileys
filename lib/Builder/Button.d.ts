export interface NativeButton {
    name: string;
    buttonParamsJson: string;
}

export interface SectionRow {
    header?: string;
    title: string;
    description?: string;
    id: string;
}

export interface SingleSelectSection {
    title: string;
    highlight_label?: string;
    rows: SectionRow[];
}

export declare function quickReply(displayText: string, id?: string): NativeButton;
export declare function url(displayText: string, targetUrl: string, merchantUrl?: string): NativeButton;
export declare function call(displayText: string, phoneNumber: string): NativeButton;
export declare function copy(displayText: string, copyCode?: string): NativeButton;
export declare function singleSelect(title: string, sections: SingleSelectSection[]): NativeButton;
export declare function sendLocation(): NativeButton;
export declare function createButtons(buttons?: any[]): NativeButton[];
export declare function createButtonMessage(options?: {
    body?: string;
    footer?: string;
    header?: any;
    buttons?: any[];
}): any;

export declare class ButtonBuilder {
    buttons: NativeButton[];
    bodyText: string;
    footerText: string;
    headerData: any;

    setBody(text: string): this;
    setFooter(text: string): this;
    setHeader(header: any): this;
    addQuickReply(displayText: string, id?: string): this;
    addUrl(displayText: string, targetUrl: string, merchantUrl?: string): this;
    addCall(displayText: string, phoneNumber: string): this;
    addCopy(displayText: string, copyCode?: string): this;
    addSingleSelect(title: string, sections: SingleSelectSection[]): this;
    addSendLocation(): this;
    addRaw(buttonObject: NativeButton): this;
    build(): any;
    send(sock: any, jid: string, quoted?: any): Promise<any>;
}

export declare const Button: {
    quickReply: typeof quickReply;
    url: typeof url;
    call: typeof call;
    copy: typeof copy;
    singleSelect: typeof singleSelect;
    sendLocation: typeof sendLocation;
    createButtons: typeof createButtons;
    createButtonMessage: typeof createButtonMessage;
    Builder: typeof ButtonBuilder;
};

export declare const ButtonV2: typeof ButtonBuilder;
export default Button;
