"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

const EventEmitter = require("events");
const https = require("https");

class TelegramBot extends EventEmitter {
    constructor(token, options = {}) {
        super();
        if (!token) throw new Error("Telegram bot token is required");
        this.token = token;
        this.apiBase = options.apiBase || `https://api.telegram.org/bot${token}`;
        this.polling = false;
        this.lastUpdateId = 0;
        this.pollingTimeout = null;
    }

    async request(method, payload = {}) {
        const url = `${this.apiBase}/${method}`;
        
        if (typeof fetch === "function") {
            const isFormData = payload instanceof (global.FormData || Object);
            const headers = isFormData ? {} : { "Content-Type": "application/json" };
            const body = isFormData ? payload : JSON.stringify(payload);

            const res = await fetch(url, {
                method: "POST",
                headers,
                body
            });
            const data = await res.json();
            if (!data.ok) {
                throw new Error(`Telegram API Error [${data.error_code}]: ${data.description}`);
            }
            return data.result;
        }

        return new Promise((resolve, reject) => {
            const dataString = JSON.stringify(payload);
            const req = https.request(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(dataString)
                }
            }, (res) => {
                let body = "";
                res.on("data", chunk => body += chunk);
                res.on("end", () => {
                    try {
                        const parsed = JSON.parse(body);
                        if (parsed.ok) resolve(parsed.result);
                        else reject(new Error(`Telegram API Error: ${parsed.description}`));
                    } catch (e) {
                        reject(e);
                    }
                });
            });
            req.on("error", reject);
            req.write(dataString);
            req.end();
        });
    }

    async getMe() {
        return this.request("getMe");
    }

    async sendMessage(chatId, text, options = {}) {
        return this.request("sendMessage", {
            chat_id: chatId,
            text: String(text),
            parse_mode: options.parse_mode || "Markdown",
            ...options
        });
    }

    async sendButtons(chatId, text, inlineKeyboard = [], options = {}) {
        return this.request("sendMessage", {
            chat_id: chatId,
            text: String(text),
            parse_mode: options.parse_mode || "Markdown",
            reply_markup: {
                inline_keyboard: inlineKeyboard
            },
            ...options
        });
    }

    async sendPhoto(chatId, photo, caption = "", options = {}) {
        return this.request("sendPhoto", {
            chat_id: chatId,
            photo: photo,
            caption: caption,
            parse_mode: options.parse_mode || "Markdown",
            ...options
        });
    }

    async sendDocument(chatId, document, caption = "", options = {}) {
        return this.request("sendDocument", {
            chat_id: chatId,
            document: document,
            caption: caption,
            parse_mode: options.parse_mode || "Markdown",
            ...options
        });
    }

    startPolling(intervalMs = 1000) {
        if (this.polling) return;
        this.polling = true;

        const poll = async () => {
            if (!this.polling) return;
            try {
                const updates = await this.request("getUpdates", {
                    offset: this.lastUpdateId + 1,
                    timeout: 20
                });

                if (Array.isArray(updates)) {
                    for (const update of updates) {
                        this.lastUpdateId = Math.max(this.lastUpdateId, update.update_id);
                        this.emit("update", update);

                        if (update.message) {
                            this.emit("message", update.message);
                            if (update.message.text?.startsWith("/")) {
                                const [cmd, ...args] = update.message.text.split(" ");
                                this.emit("command", { command: cmd, args, message: update.message });
                            }
                        } else if (update.callback_query) {
                            this.emit("callback_query", update.callback_query);
                        }
                    }
                }
            } catch (err) {
                this.emit("error", err);
            }

            if (this.polling) {
                this.pollingTimeout = setTimeout(poll, intervalMs);
            }
        };

        poll();
    }

    stopPolling() {
        this.polling = false;
        if (this.pollingTimeout) {
            clearTimeout(this.pollingTimeout);
            this.pollingTimeout = null;
        }
    }
}

function makeTelegramBot(token, options) {
    return new TelegramBot(token, options);
}

exports.TelegramBot = TelegramBot;
exports.makeTelegramBot = makeTelegramBot;
exports.default = TelegramBot;
