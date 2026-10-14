"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

const { Readable } = require("stream");

function formatJid(jid) {
    if (!jid) return "";
    let clean = String(jid).trim().replace(/[^0-9@a-zA-Z._-]/g, "");
    if (clean.endsWith("@g.us") || clean.endsWith("@s.whatsapp.net") || clean.endsWith("@newsletter") || clean.endsWith("@broadcast") || clean.endsWith("@lid")) {
        return clean;
    }
    if (clean.includes("-") && !clean.includes("@")) {
        return `${clean}@g.us`;
    }
    return `${clean}@s.whatsapp.net`;
}

function isJidGroup(jid) {
    return typeof jid === "string" && (jid.endsWith("@g.us") || jid.endsWith("@temp"));
}

function isJidUser(jid) {
    return typeof jid === "string" && (jid.endsWith("@s.whatsapp.net") || jid.endsWith("@c.us"));
}

function isJidBroadcast(jid) {
    return typeof jid === "string" && (jid.endsWith("@broadcast") || jid === "status@broadcast");
}

function isJidNewsletter(jid) {
    return typeof jid === "string" && jid.endsWith("@newsletter");
}

function isJidStatus(jid) {
    return typeof jid === "string" && jid === "status@broadcast";
}

function jidToPhone(jid) {
    if (!jid) return "";
    return String(jid).split("@")[0].split(":")[0].replace(/[^0-9]/g, "");
}

function phoneToJid(phone) {
    if (!phone) return "";
    const clean = String(phone).replace(/[^0-9]/g, "");
    return `${clean}@s.whatsapp.net`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, Number(ms) || 0));
}

async function retry(fn, retries = 3, delayMs = 1000) {
    let lastError;
    for (let i = 0; i < retries; i++) {
        try {
            return await fn(i);
        } catch (err) {
            lastError = err;
            if (i < retries - 1) {
                await sleep(delayMs * Math.pow(2, i));
            }
        }
    }
    throw lastError;
}

function extractMessageText(message) {
    if (!message) return "";
    const msg = message.message || message;
    if (typeof msg !== "object") return "";

    if (msg.conversation) return msg.conversation;
    if (msg.extendedTextMessage?.text) return msg.extendedTextMessage.text;
    if (msg.imageMessage?.caption) return msg.imageMessage.caption;
    if (msg.videoMessage?.caption) return msg.videoMessage.caption;
    if (msg.documentMessage?.caption) return msg.documentMessage.caption;
    if (msg.documentWithCaptionMessage?.message?.documentMessage?.caption) {
        return msg.documentWithCaptionMessage.message.documentMessage.caption;
    }
    if (msg.buttonsResponseMessage?.selectedButtonId) {
        return msg.buttonsResponseMessage.selectedButtonId;
    }
    if (msg.templateButtonReplyMessage?.selectedId) {
        return msg.templateButtonReplyMessage.selectedId;
    }
    if (msg.listResponseMessage?.singleSelectReply?.selectedRowId) {
        return msg.listResponseMessage.singleSelectReply.selectedRowId;
    }
    if (msg.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson) {
        try {
            const parsed = JSON.parse(msg.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson);
            return parsed.id || parsed.selected_id || parsed.display_text || "";
        } catch {}
    }
    if (msg.pollCreationMessage?.name) return msg.pollCreationMessage.name;
    return "";
}

function extractMessageMedia(message) {
    if (!message) return null;
    const msg = message.message || message;
    if (!msg || typeof msg !== "object") return null;

    if (msg.imageMessage) return { type: "image", media: msg.imageMessage };
    if (msg.videoMessage) return { type: "video", media: msg.videoMessage };
    if (msg.audioMessage) return { type: "audio", media: msg.audioMessage };
    if (msg.documentMessage) return { type: "document", media: msg.documentMessage };
    if (msg.stickerMessage) return { type: "sticker", media: msg.stickerMessage };
    if (msg.documentWithCaptionMessage?.message?.documentMessage) {
        return { type: "document", media: msg.documentWithCaptionMessage.message.documentMessage };
    }
    return null;
}

function bufferToStream(buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

async function streamToBuffer(stream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

function formatBytes(bytes, decimals = 2) {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function formatDuration(seconds) {
    const sec = Math.floor(Number(seconds) || 0);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    const h = Math.floor(sec / 3600);
    if (h > 0) {
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function generateId(prefix = "ALYA") {
    const rnd = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `${prefix}_${Date.now()}_${rnd}`;
}

async function downloadMedia(message, options = {}) {
    const extracted = extractMessageMedia(message);
    if (!extracted) throw new Error("No downloadable media found in message");
    const { downloadContentFromMessage } = require("../Utils");
    if (!downloadContentFromMessage) {
        throw new Error("downloadContentFromMessage utility not available");
    }
    const stream = await downloadContentFromMessage(extracted.media, extracted.type, options);
    return streamToBuffer(stream);
}

const Toolkit = {
    formatJid,
    isJidGroup,
    isJidUser,
    isJidBroadcast,
    isJidNewsletter,
    isJidStatus,
    jidToPhone,
    phoneToJid,
    sleep,
    retry,
    extractMessageText,
    extractMessageMedia,
    bufferToStream,
    streamToBuffer,
    formatBytes,
    formatDuration,
    generateId,
    downloadMedia
};

exports.formatJid = formatJid;
exports.isJidGroup = isJidGroup;
exports.isJidUser = isJidUser;
exports.isJidBroadcast = isJidBroadcast;
exports.isJidNewsletter = isJidNewsletter;
exports.isJidStatus = isJidStatus;
exports.jidToPhone = jidToPhone;
exports.phoneToJid = phoneToJid;
exports.sleep = sleep;
exports.retry = retry;
exports.extractMessageText = extractMessageText;
exports.extractMessageMedia = extractMessageMedia;
exports.bufferToStream = bufferToStream;
exports.streamToBuffer = streamToBuffer;
exports.formatBytes = formatBytes;
exports.formatDuration = formatDuration;
exports.generateId = generateId;
exports.downloadMedia = downloadMedia;
exports.Toolkit = Toolkit;
exports.default = Toolkit;
