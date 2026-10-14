"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

function quickReply(displayText, id) {
    return {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
            display_text: String(displayText),
            id: String(id || displayText)
        })
    };
}

function url(displayText, targetUrl, merchantUrl) {
    return {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
            display_text: String(displayText),
            url: String(targetUrl),
            merchant_url: String(merchantUrl || targetUrl)
        })
    };
}

function call(displayText, phoneNumber) {
    return {
        name: "cta_call",
        buttonParamsJson: JSON.stringify({
            display_text: String(displayText),
            phone_number: String(phoneNumber)
        })
    };
}

function copy(displayText, copyCode) {
    return {
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
            display_text: String(displayText),
            copy_code: String(copyCode || displayText)
        })
    };
}

function singleSelect(title, sections = []) {
    return {
        name: "single_select",
        buttonParamsJson: JSON.stringify({
            title: String(title),
            sections: sections.map(sec => ({
                title: String(sec.title || ""),
                highlight_label: sec.highlight_label || "",
                rows: (sec.rows || []).map(row => ({
                    header: row.header || "",
                    title: String(row.title || ""),
                    description: row.description || "",
                    id: String(row.id || row.title)
                }))
            }))
        })
    };
}

function sendLocation() {
    return {
        name: "send_location",
        buttonParamsJson: "{}"
    };
}

function createButtons(buttons = []) {
    return buttons.map(btn => {
        if (!btn) return null;
        if (btn.name && btn.buttonParamsJson) return btn;
        if (btn.type === "url" || btn.url) {
            return url(btn.text || btn.displayText || btn.title, btn.url);
        }
        if (btn.type === "call" || btn.phone || btn.phoneNumber) {
            return call(btn.text || btn.displayText || btn.title, btn.phone || btn.phoneNumber);
        }
        if (btn.type === "copy" || btn.copy) {
            return copy(btn.text || btn.displayText || btn.title, btn.copy || btn.code);
        }
        if (btn.type === "single_select" || btn.sections) {
            return singleSelect(btn.title || btn.text, btn.sections);
        }
        return quickReply(btn.text || btn.displayText || btn.title || btn.id, btn.id);
    }).filter(Boolean);
}

function createButtonMessage(options = {}) {
    const {
        body = "",
        footer = "",
        header = null,
        buttons = []
    } = options;

    let headerObj = null;
    if (typeof header === "string") {
        headerObj = { title: header, hasMediaAttachment: false };
    } else if (header && typeof header === "object") {
        headerObj = header;
    }

    const nativeButtons = Array.isArray(buttons) ? createButtons(buttons) : [];

    return {
        interactiveMessage: {
            header: headerObj || { hasMediaAttachment: false },
            body: { text: String(body) },
            footer: { text: String(footer || "Powered by Alya-Baileys") },
            nativeFlowMessage: {
                buttons: nativeButtons
            }
        }
    };
}

class ButtonBuilder {
    constructor() {
        this.buttons = [];
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

    addRaw(buttonObject) {
        this.buttons.push(buttonObject);
        return this;
    }

    build() {
        return createButtonMessage({
            body: this.bodyText,
            footer: this.footerText,
            header: this.headerData,
            buttons: this.buttons
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

const Button = {
    quickReply,
    url,
    call,
    copy,
    singleSelect,
    sendLocation,
    createButtons,
    createButtonMessage,
    Builder: ButtonBuilder
};

const ButtonV2 = ButtonBuilder;

exports.quickReply = quickReply;
exports.url = url;
exports.call = call;
exports.copy = copy;
exports.singleSelect = singleSelect;
exports.sendLocation = sendLocation;
exports.createButtons = createButtons;
exports.createButtonMessage = createButtonMessage;
exports.ButtonBuilder = ButtonBuilder;
exports.Button = Button;
exports.ButtonV2 = ButtonV2;
exports.default = Button;
