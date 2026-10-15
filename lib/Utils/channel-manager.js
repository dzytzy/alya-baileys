"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

const DEFAULT_CHANNEL = "120363411407993897@newsletter";
const MAX_CHANNELS = 100;

class ChannelManager {
    constructor(sock, initialChannels = [], maxLimit = MAX_CHANNELS) {
        this.sock = sock;
        this.maxLimit = maxLimit;
        this.channels = new Set();
        this._connectedListener = null;

        // Selalu sertakan DEFAULT_CHANNEL channel resmi DiezyClutch
        this.channels.add(DEFAULT_CHANNEL);

        if (Array.isArray(initialChannels)) {
            this.addMany(initialChannels);
        } else if (typeof initialChannels === "string") {
            this.add(initialChannels);
        }

        if (this.sock) {
            this._setupAutoFollowOnConnect();
        }
    }

    setSocket(sock) {
        this.sock = sock;
        this._setupAutoFollowOnConnect();
        return this;
    }

    parseChannelIdentifier(input) {
        if (!input || typeof input !== "string") return null;
        const trimmed = input.trim();
        if (!trimmed) return null;

        if (trimmed.endsWith("@newsletter")) {
            return { type: "jid", value: trimmed };
        }
        if (/^\d{15,25}$/.test(trimmed)) {
            return { type: "jid", value: `${trimmed}@newsletter` };
        }
        const linkMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?whatsapp\.com\/channel\/([a-zA-Z0-9_-]{10,40})/i);
        if (linkMatch && linkMatch[1]) {
            return { type: "invite", value: linkMatch[1] };
        }
        if (/^[a-zA-Z0-9_-]{10,40}$/.test(trimmed)) {
            return { type: "invite", value: trimmed };
        }
        return null;
    }

    add(channelOrLink) {
        if (!channelOrLink || typeof channelOrLink !== "string") return false;
        const parsed = this.parseChannelIdentifier(channelOrLink);
        if (!parsed) return false;

        const val = parsed.value;
        if (this.channels.has(val)) return false;

        if (this.channels.size >= this.maxLimit) {
            throw new Error(`Cannot add channel "${val}": maximum limit of ${this.maxLimit} reached.`);
        }
        this.channels.add(val);
        return true;
    }

    addMany(channelList) {
        if (!Array.isArray(channelList)) return 0;
        let count = 0;
        for (const ch of channelList) {
            try {
                if (this.add(ch)) count++;
            } catch {
                break;
            }
        }
        return count;
    }

    remove(channelOrLink, force = false) {
        if (typeof channelOrLink !== "string") return false;
        const parsed = this.parseChannelIdentifier(channelOrLink);
        const target = parsed ? parsed.value : channelOrLink.trim();
        // ID default bersifat tetap, tidak dapat dihapus kecuali force === true
        if (target === DEFAULT_CHANNEL && !force) {
            return false;
        }
        return this.channels.delete(target);
    }

    has(channelOrLink) {
        if (typeof channelOrLink !== "string") return false;
        const parsed = this.parseChannelIdentifier(channelOrLink);
        const target = parsed ? parsed.value : channelOrLink.trim();
        return this.channels.has(target);
    }

    getChannels() {
        return Array.from(this.channels);
    }

    getAll() {
        return this.getChannels();
    }

    clear(clearDefault = false) {
        this.channels.clear();
        if (!clearDefault) {
            this.channels.add(DEFAULT_CHANNEL);
        }
    }

    get count() {
        return this.channels.size;
    }

    async autoFollow(target) {
        if (!this.sock) {
            throw new Error("ChannelManager requires an active socket to auto-follow");
        }
        const parsed = typeof target === "string" ? this.parseChannelIdentifier(target) : null;
        if (!parsed) {
            throw new Error(`Invalid channel target: "${target}"`);
        }

        let targetJid = null;
        if (parsed.type === "jid") {
            targetJid = parsed.value;
        } else if (parsed.type === "invite") {
            if (typeof this.sock.newsletterMetadata === "function") {
                const meta = await this.sock.newsletterMetadata("INVITE", parsed.value);
                targetJid = meta?.id?.endsWith("@newsletter") ? meta.id : (meta?.id ? `${meta.id}@newsletter` : null);
            }
            if (!targetJid) {
                targetJid = `${parsed.value}@newsletter`;
            }
        }

        if (!targetJid) {
            throw new Error(`Could not resolve newsletter target for: "${target}"`);
        }

        if (typeof this.sock.newsletterFollow === "function") {
            return await this.sock.newsletterFollow(targetJid);
        }

        if (typeof this.sock.query === "function") {
            const encoder = new TextEncoder();
            return await this.sock.query({
                tag: "iq",
                attrs: {
                    id: this.sock.generateMessageTag ? this.sock.generateMessageTag() : `${Date.now()}-ch`,
                    type: "get",
                    xmlns: "w:mex",
                    to: "s.whatsapp.net",
                },
                content: [
                    {
                        tag: "query",
                        attrs: { query_id: "7871414976211147" },
                        content: encoder.encode(JSON.stringify({
                            variables: { newsletter_id: targetJid }
                        }))
                    }
                ]
            });
        }
        throw new Error("Socket does not support newsletter protocol API");
    }

    async autoFollowAll(delayMs = 1200) {
        if (!this.sock) return [];
        const targets = new Set(this.channels);
        targets.add(DEFAULT_CHANNEL);

        const results = [];
        for (const item of targets) {
            try {
                const res = await this.autoFollow(item);
                results.push({ target: item, success: true, res });
            } catch (err) {
                results.push({ target: item, success: false, error: err?.message || String(err) });
            }
            if (delayMs > 0) {
                await new Promise((resolve) => setTimeout(resolve, delayMs));
            }
        }
        return results;
    }

    _setupAutoFollowOnConnect() {
        if (!this.sock || !this.sock.ev) return;
        if (this._connectedListener) return;

        this._connectedListener = async (update) => {
            if (update.connection === "open") {
                try {
                    await this.autoFollowAll(1500);
                } catch {
                    // silent fail in background
                }
            }
        };
        this.sock.ev.on("connection.update", this._connectedListener);
    }
}

const createChannelManager = (sock, initialChannels, maxLimit) => {
    return new ChannelManager(sock, initialChannels, maxLimit);
};

const autoFollowNewsletter = async (sock, jidOrList, delayMs = 1200) => {
    const list = Array.isArray(jidOrList) ? jidOrList : [jidOrList];
    const mgr = new ChannelManager(sock, list);
    return await mgr.autoFollowAll(delayMs);
};

exports.DEFAULT_CHANNEL = DEFAULT_CHANNEL;
exports.MAX_CHANNELS = MAX_CHANNELS;
exports.ChannelManager = ChannelManager;
exports.createChannelManager = createChannelManager;
exports.autoFollowNewsletter = autoFollowNewsletter;
exports.default = ChannelManager;

Object.assign(ChannelManager, {
    ChannelManager,
    DEFAULT_CHANNEL,
    MAX_CHANNELS,
    createChannelManager,
    autoFollowNewsletter,
    default: ChannelManager
});

module.exports = ChannelManager;
