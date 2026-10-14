"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

function a2uiText(text, options = {}) {
    return {
        type: "text",
        text: String(text || ""),
        weight: options.weight || "regular",
        size: options.size || "medium",
        color: options.color || "default",
        align: options.align || "left"
    };
}

function a2uiImage(url, options = {}) {
    return {
        type: "image",
        url: url,
        aspectRatio: options.aspectRatio || "16:9",
        width: options.width,
        height: options.height,
        description: options.description || ""
    };
}

function a2uiColumn(children = [], options = {}) {
    return {
        type: "column",
        children: Array.isArray(children) ? children : [children],
        alignment: options.alignment || "stretch",
        spacing: options.spacing || "medium"
    };
}

function a2uiRow(children = [], options = {}) {
    return {
        type: "row",
        children: Array.isArray(children) ? children : [children],
        alignment: options.alignment || "center",
        spacing: options.spacing || "small"
    };
}

function a2uiCard(content = [], options = {}) {
    return {
        type: "card",
        title: options.title || "",
        subtitle: options.subtitle || "",
        components: Array.isArray(content) ? content : [content],
        elevation: options.elevation || 1,
        corner_radius: options.cornerRadius || 8
    };
}

function a2uiWidget(widgetType, properties = {}) {
    return {
        type: "widget",
        widgetType: widgetType,
        properties: properties
    };
}

function a2uiSurface(components = [], options = {}) {
    return {
        version: options.version || "1.0",
        surface: "im_a2ui",
        meta: {
            title: options.title || "A2UI Surface",
            timestamp: Date.now(),
            ...options.meta
        },
        layout: {
            type: "column",
            children: Array.isArray(components) ? components : [components]
        }
    };
}

class A2UIBuilder {
    constructor() {
        this.components = [];
        this.titleText = "";
        this.bodyText = "";
        this.footerText = "";
        this.headerData = null;
        this.metadata = {};
    }

    setTitle(title) {
        this.titleText = title;
        return this;
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

    addText(text, options) {
        this.components.push(a2uiText(text, options));
        return this;
    }

    addImage(url, options) {
        this.components.push(a2uiImage(url, options));
        return this;
    }

    addCard(content, options) {
        this.components.push(a2uiCard(content, options));
        return this;
    }

    addRow(children, options) {
        this.components.push(a2uiRow(children, options));
        return this;
    }

    addColumn(children, options) {
        this.components.push(a2uiColumn(children, options));
        return this;
    }

    addWidget(type, props) {
        this.components.push(a2uiWidget(type, props));
        return this;
    }

    setMetadata(meta) {
        this.metadata = { ...this.metadata, ...meta };
        return this;
    }

    buildPayload() {
        return a2uiSurface(this.components, {
            title: this.titleText || "Alya A2UI",
            meta: this.metadata
        });
    }

    buildMessage() {
        const payload = this.buildPayload();
        const header = typeof this.headerData === "string" 
            ? { title: this.headerData, hasMediaAttachment: false }
            : (this.headerData || { title: this.titleText || "Alya Baileys A2UI", hasMediaAttachment: false });

        return {
            interactiveMessage: {
                header: header,
                body: { text: this.bodyText || this.titleText || "Interactive A2UI Widget" },
                footer: { text: this.footerText || "Powered by Alya-Baileys" },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: "im_a2ui",
                            buttonParamsJson: JSON.stringify(payload)
                        }
                    ]
                }
            }
        };
    }

    async send(sock, jid, quoted) {
        return sendA2UI(sock, jid, this.buildMessage(), { quoted });
    }
}

async function sendA2UI(sock, jid, payload, options = {}) {
    if (!sock || !jid) {
        throw new Error("sock and jid are required to send A2UI message");
    }

    let messageContent;
    if (payload instanceof A2UIBuilder) {
        messageContent = payload.buildMessage();
    } else if (payload && payload.interactiveMessage) {
        messageContent = payload;
    } else if (payload && (payload.components || payload.layout || payload.surface)) {
        messageContent = {
            interactiveMessage: {
                header: { title: options.title || "Alya A2UI", hasMediaAttachment: false },
                body: { text: options.body || "Interactive A2UI Widget" },
                footer: { text: options.footer || "Powered by Alya-Baileys" },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: "im_a2ui",
                            buttonParamsJson: JSON.stringify(payload)
                        }
                    ]
                }
            }
        };
    } else {
        throw new Error("Invalid A2UI payload format");
    }

    if (sock.relayMessage) {
        const { proto } = require("../../WAProto");
        const msg = proto.Message.fromObject(messageContent);
        const { generateMessageIDV2 } = require("../Utils");
        const msgId = generateMessageIDV2 ? generateMessageIDV2(sock.user?.id) : "ALYA_" + Date.now();
        
        await sock.relayMessage(jid, msg, {
            messageId: msgId,
            ...options
        });
        return { key: { remoteJid: jid, id: msgId, fromMe: true }, message: msg };
    }

    return sock.sendMessage(jid, messageContent, options);
}

exports.a2uiText = a2uiText;
exports.a2uiImage = a2uiImage;
exports.a2uiColumn = a2uiColumn;
exports.a2uiRow = a2uiRow;
exports.a2uiCard = a2uiCard;
exports.a2uiWidget = a2uiWidget;
exports.a2uiSurface = a2uiSurface;
exports.A2UIBuilder = A2UIBuilder;
exports.A2UI = A2UIBuilder;
exports.sendA2UI = sendA2UI;
exports.default = A2UIBuilder;
