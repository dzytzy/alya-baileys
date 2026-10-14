import { NativeButton, SingleSelectSection } from "./Button";
import { CarouselCardOptions } from "./Carousel";

export declare class MessageBuilder {
    bodyText: string;
    footerText: string;
    headerData: any;
    buttons: NativeButton[];
    carouselCards: any[];
    a2uiData: any;
    mediaData: any;
    contextInfoData: any;

    setText(text: string): this;
    setBody(text: string): this;
    setFooter(text: string): this;
    setHeader(header: any): this;
    setMedia(media: any, type?: string, options?: Record<string, any>): this;
    setContextInfo(contextInfo: any): this;
    addQuickReply(displayText: string, id?: string): this;
    addUrl(displayText: string, targetUrl: string, merchantUrl?: string): this;
    addCall(displayText: string, phoneNumber: string): this;
    addCopy(displayText: string, copyCode?: string): this;
    addSingleSelect(title: string, sections: SingleSelectSection[]): this;
    addSendLocation(): this;
    addButton(button: any): this;
    addCarouselCard(card: CarouselCardOptions): this;
    setA2UI(a2uiPayload: any): this;
    build(): any;
    send(sock: any, jid: string, options?: Record<string, any>): Promise<any>;
}

export declare const MB: typeof MessageBuilder;
export default MessageBuilder;
