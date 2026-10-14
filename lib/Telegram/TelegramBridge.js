"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

const EventEmitter = require("events");
const { extractMessageText } = require("../Builder/Toolkit");

class TelegramBridge extends EventEmitter {
    constructor(sock, tgBot, options = {}) {
        super();
        this.sock = sock;
        this.tgBot = tgBot;
        this.options = {
            forwardWhatsAppToTelegram: true,
            forwardTelegramToWhatsApp: false,
            telegramChatId: null,
            whatsAppJid: null,
            ...options
        };

        this.init();
    }

    init() {
        if (this.sock?.ev) {
            this.sock.ev.on("messages.upsert", async ({ messages }) => {
                if (!this.options.forwardWhatsAppToTelegram || !this.options.telegramChatId) return;
                for (const msg of messages) {
                    if (msg.key?.fromMe) continue;
                    await this.handleWhatsAppMessage(msg);
                }
            });
        }

        if (this.tgBot) {
            this.tgBot.on("message", async (tgMsg) => {
                if (!this.options.forwardTelegramToWhatsApp || !this.options.whatsAppJid) return;
                await this.handleTelegramMessage(tgMsg);
            });
        }
    }

    async handleWhatsAppMessage(waMsg) {
        try {
            const sender = waMsg.key?.remoteJid || "Unknown";
            const pushName = waMsg.pushName || "WhatsApp User";
            const text = extractMessageText(waMsg);

            if (!text) return;

            const header = `📨 *[WhatsApp: ${pushName}]*\n` +
                           `👤 JID: \`${sender}\`\n\n`;

            await this.tgBot.sendMessage(this.options.telegramChatId, header + text);
            this.emit("forward:wa->tg", { waMsg, sender, text });
        } catch (err) {
            this.emit("error", err);
        }
    }

    async handleTelegramMessage(tgMsg) {
        try {
            const fromUser = tgMsg.from?.first_name || tgMsg.from?.username || "Telegram User";
            const text = tgMsg.text || tgMsg.caption || "";

            if (!text) return;

            const formatted = `💬 *[Telegram: ${fromUser}]*\n\n${text}`;
            await this.sock.sendMessage(this.options.whatsAppJid, { text: formatted });
            this.emit("forward:tg->wa", { tgMsg, fromUser, text });
        } catch (err) {
            this.emit("error", err);
        }
    }

    convertButtonsToTelegram(buttons = []) {
        const inlineKeyboard = [];
        let currentRow = [];

        for (const btn of buttons) {
            let label = "Button";
            let callbackData = "alya_btn";

            if (btn.name === "cta_url" && btn.buttonParamsJson) {
                try {
                    const parsed = JSON.parse(btn.buttonParamsJson);
                    currentRow.push({ text: parsed.display_text || "URL", url: parsed.url });
                } catch {}
            } else if (btn.name === "quick_reply" && btn.buttonParamsJson) {
                try {
                    const parsed = JSON.parse(btn.buttonParamsJson);
                    currentRow.push({ text: parsed.display_text || "Option", callback_data: parsed.id || "btn" });
                } catch {}
            } else if (btn.name === "cta_copy" && btn.buttonParamsJson) {
                try {
                    const parsed = JSON.parse(btn.buttonParamsJson);
                    currentRow.push({ text: `📋 ${parsed.display_text || "Copy"}`, callback_data: `copy_${parsed.copy_code}` });
                } catch {}
            }

            if (currentRow.length >= 2) {
                inlineKeyboard.push(currentRow);
                currentRow = [];
            }
        }

        if (currentRow.length > 0) {
            inlineKeyboard.push(currentRow);
        }

        return inlineKeyboard;
    }

    convertTelegramButtonsToWhatsApp(inlineKeyboard = []) {
        const waButtons = [];
        for (const row of inlineKeyboard) {
            for (const btn of row) {
                if (btn.url) {
                    waButtons.push({
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                            display_text: btn.text,
                            url: btn.url,
                            merchant_url: btn.url
                        })
                    });
                } else if (btn.callback_data) {
                    waButtons.push({
                        name: "quick_reply",
                        buttonParamsJson: JSON.stringify({
                            display_text: btn.text,
                            id: btn.callback_data
                        })
                    });
                }
            }
        }
        return waButtons;
    }
}

function makeTelegramBridge(sock, tgBot, options) {
    return new TelegramBridge(sock, tgBot, options);
}

exports.TelegramBridge = TelegramBridge;
exports.makeTelegramBridge = makeTelegramBridge;
exports.default = TelegramBridge;
