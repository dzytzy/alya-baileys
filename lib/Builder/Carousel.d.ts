export interface CarouselCardOptions {
    header?: any;
    body: string;
    footer?: string;
    buttons?: any[];
}

export declare function createCarouselCard(card?: CarouselCardOptions): any;
export declare function createCarouselMessage(options?: {
    body?: string;
    footer?: string;
    header?: any;
    cards?: CarouselCardOptions[];
}): any;

export declare class CarouselBuilder {
    cards: any[];
    bodyText: string;
    footerText: string;
    headerData: any;

    setBody(text: string): this;
    setFooter(text: string): this;
    setHeader(header: any): this;
    addCard(card: CarouselCardOptions): this;
    addCards(cards: CarouselCardOptions[]): this;
    build(): any;
    send(sock: any, jid: string, quoted?: any): Promise<any>;
}

export declare const Carousel: {
    createCarouselCard: typeof createCarouselCard;
    createCarouselMessage: typeof createCarouselMessage;
    Builder: typeof CarouselBuilder;
};

export default Carousel;
