"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

const { quickReply, url, call, copy, singleSelect, sendLocation, createButtons } = require("./Button");
const { createCarouselCard, createCarouselMessage } = require("./Carousel");
const { a2uiText, a2uiImage, a2uiCard, a2uiSurface } = require("./A2UI");

class MessageBuilder {
    constructor() {
        this.bodyText = "";
        this.footerText = "";
        this.headerData = null;
        this.buttons = [];
        this.carouselCards = [];
        this.a2uiData = null;
        this.mediaData = null;
        this.contextInfoData = null;
    }

    setText(text) {
        this.bodyText = String(text || "");
        return this;
    }

    setBody(text) {
        this.bodyText = String(text || "");
        return this;
    }

    setFooter(text) {
        this.footerText = String(text || "");
        return this;
    }

    setHeader(header) {
        if (typeof header === "string") {
            this.headerData = { title: header, hasMediaAttachment: false };
        } else {
            this.headerData = header;
        }
        return this;
    }

    setMedia(media, type = "image", options = {}) {
        this.mediaData = { media, type, options };
        return this;
    }

    setContextInfo(contextInfo) {
        this.contextInfoData = contextInfo;
        return this;
    }

    addQuickReply(displayText, id) {
        this.buttons.push(quickReply(displayText, id));
        return this;
    }

    addUrl(displayText, targetUrl, merchantUrl) {
        this.buttons.push(url(displayText, targetUrl, merchantUrl));
        return this;
    }

    addCall(displayText, phoneNumber) {
        this.buttons.push(call(displayText, phoneNumber));
        return this;
    }

    addCopy(displayText, copyCode) {
        this.buttons.push(copy(displayText, copyCode));
        return this;
    }

    addSingleSelect(title, sections) {
        this.buttons.push(singleSelect(title, sections));
        return this;
    }

    addSendLocation() {
        this.buttons.push(sendLocation());
        return this;
    }

    addButton(button) {
        const prepared = createButtons([button])[0];
        if (prepared) this.buttons.push(prepared);
        return this;
    }

    addCarouselCard(card) {
        this.carouselCards.push(createCarouselCard(card));
        return this;
    }

    setA2UI(a2uiPayload) {
        this.a2uiData = a2uiPayload;
        return this;
    }

    build() {
        const header = this.headerData || { hasMediaAttachment: Boolean(this.mediaData) };

        if (this.carouselCards.length > 0) {
            return {
                interactiveMessage: {
                    header: header,
                    body: { text: this.bodyText || "Alya Carousel" },
                    footer: { text: this.footerText || "Powered by Alya-Baileys" },
                    contextInfo: this.contextInfoData || undefined,
                    carouselMessage: {
                        cards: this.carouselCards,
                        messageVersion: 1
                    }
                }
            };
        }

        if (this.a2uiData) {
            const payload = typeof this.a2uiData === "object" ? JSON.stringify(this.a2uiData) : String(this.a2uiData);
            return {
                interactiveMessage: {
                    header: header,
                    body: { text: this.bodyText || "Alya A2UI Widget" },
                    footer: { text: this.footerText || "Powered by Alya-Baileys" },
                    contextInfo: this.contextInfoData || undefined,
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "im_a2ui",
                                buttonParamsJson: payload
                            }
                        ]
                    }
                }
            };
        }

        if (this.buttons.length > 0) {
            return {
                interactiveMessage: {
                    header: header,
                    body: { text: this.bodyText },
                    footer: { text: this.footerText || "Powered by Alya-Baileys" },
                    contextInfo: this.contextInfoData || undefined,
                    nativeFlowMessage: {
                        buttons: this.buttons
                    }
                }
            };
        }

        if (this.mediaData) {
            const result = { [this.mediaData.type]: this.mediaData.media, caption: this.bodyText, ...this.mediaData.options };
            if (this.contextInfoData) result.contextInfo = this.contextInfoData;
            return result;
        }

        const textMsg = { text: this.bodyText };
        if (this.contextInfoData) textMsg.contextInfo = this.contextInfoData;
        return textMsg;
    }

    async send(sock, jid, options = {}) {
        if (!sock || !jid) throw new Error("sock and jid are required");
        const msg = this.build();

        if (msg.interactiveMessage && sock.relayMessage) {
            const { proto } = require("../../WAProto");
            const protoMsg = proto.Message.fromObject(msg);
            const { generateMessageIDV2 } = require("../Utils");
            const msgId = generateMessageIDV2 ? generateMessageIDV2(sock.user?.id) : "ALYA_" + Date.now();
            await sock.relayMessage(jid, protoMsg, {
                messageId: msgId,
                ...options
            });
            return { key: { remoteJid: jid, id: msgId, fromMe: true }, message: protoMsg };
        }

        return sock.sendMessage(jid, msg, options);
    }
}

const MB = MessageBuilder;

exports.MessageBuilder = MessageBuilder;
exports.MB = MB;
exports.default = MessageBuilder;
