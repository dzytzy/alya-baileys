"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

const { createButtons } = require("./Button");

function createCarouselCard(card = {}) {
    let headerObj = null;
    if (typeof card.header === "string") {
        headerObj = { title: card.header, hasMediaAttachment: false };
    } else if (card.header && typeof card.header === "object") {
        headerObj = card.header;
    } else {
        headerObj = { hasMediaAttachment: false };
    }

    const nativeButtons = Array.isArray(card.buttons) ? createButtons(card.buttons) : [];

    return {
        header: headerObj,
        body: { text: String(card.body || "") },
        footer: { text: String(card.footer || "") },
        nativeFlowMessage: {
            buttons: nativeButtons
        }
    };
}

function createCarouselMessage(options = {}) {
    const {
        body = "",
        footer = "",
        header = null,
        cards = []
    } = options;

    const formattedCards = (Array.isArray(cards) ? cards : []).map(c => createCarouselCard(c));

    let headerObj = null;
    if (typeof header === "string") {
        headerObj = { title: header, hasMediaAttachment: false };
    } else if (header && typeof header === "object") {
        headerObj = header;
    }

    return {
        interactiveMessage: {
            header: headerObj || { hasMediaAttachment: false },
            body: { text: String(body || "Browse Carousel") },
            footer: { text: String(footer || "Powered by Alya-Baileys") },
            carouselMessage: {
                cards: formattedCards,
                messageVersion: 1
            }
        }
    };
}

class CarouselBuilder {
    constructor() {
        this.cards = [];
        this.bodyText = "";
        this.footerText = "";
        this.headerData = null;
    }

    setBody(text) {
        this.bodyText = text;
        return this;
    }

    setFooter(text) {
        this.footerText = text;
        return this;
    }

    setHeader(header) {
        this.headerData = header;
        return this;
    }

    addCard(card) {
        this.cards.push(createCarouselCard(card));
        return this;
    }

    addCards(cards = []) {
        for (const card of cards) {
            this.addCard(card);
        }
        return this;
    }

    build() {
        return createCarouselMessage({
            body: this.bodyText,
            footer: this.footerText,
            header: this.headerData,
            cards: this.cards
        });
    }

    async send(sock, jid, quoted) {
        if (!sock || !jid) throw new Error("sock and jid are required");
        const msg = this.build();
        if (sock.relayMessage) {
            const { proto } = require("../../WAProto");
            const protoMsg = proto.Message.fromObject(msg);
            const { generateMessageIDV2 } = require("../Utils");
            const msgId = generateMessageIDV2 ? generateMessageIDV2(sock.user?.id) : "ALYA_" + Date.now();
            await sock.relayMessage(jid, protoMsg, { messageId: msgId, quoted });
            return { key: { remoteJid: jid, id: msgId, fromMe: true }, message: protoMsg };
        }
        return sock.sendMessage(jid, msg, { quoted });
    }
}

const Carousel = {
    create: createCarouselMessage,
    card: createCarouselCard,
    createCarouselCard,
    createCarouselMessage,
    Builder: CarouselBuilder
};

exports.createCarouselCard = createCarouselCard;
exports.createCarouselMessage = createCarouselMessage;
exports.CarouselBuilder = CarouselBuilder;
exports.Carousel = Carousel;
exports.default = Carousel;
