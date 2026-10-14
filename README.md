# 🌸 @diezyclutch/alya-baileys

<p align="center">
  <img src="https://telegra.ph/file/09ffbb8e5bb95f68bfe8d.jpg" alt="Alya Baileys" width="220" style="border-radius: 12px;"/>
</p>

<p align="center">
  <b>High-Performance WhatsApp Web Multi-Device API with Native A2UI, MessageBuilder, Buttons, Carousel, Toolkit & Telegram Bot Support</b>
</p>

<p align="center">
  <a href="https://github.com/dzytzy/alya-baileys"><img src="https://img.shields.io/badge/version-1.0.0-blue.svg?style=for-the-badge" alt="Version"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-%3E%3D20.0.0-brightgreen.svg?style=for-the-badge" alt="Node.js"></a>
  <a href="#"><img src="https://img.shields.io/badge/Module-CJS%20%C3%97%20ESM-orange.svg?style=for-the-badge" alt="Module"></a>
</p>

---

## 🌟 Highlight Features

- **⚡ CommonJS × ESM Dual Architecture**: Seamlessly import via `import makeWASocket from '@diezyclutch/alya-baileys'` or `require('@diezyclutch/alya-baileys')`.
- **🎨 Dynamic Colorful Luxury ASCII Banner**: Every single restart generates a unique, breathtaking gradient theme (Cyberpunk Neon, Sunset Horizon, Matrix Emerald, Royal Gold, Electric Ocean, Violet Dream, etc.) with full system specs.
- **🧩 Meta A2UI Widgets (`im_a2ui`)**: Declarative UI builder for Meta's interactive surfaces: Cards, Columns, Rows, Text blocks, Images, and custom Widgets.
- **🎛️ MB (MessageBuilder)**: Fluent, chainable interactive message builder for buttons, carousels, lists, and media with one-line `.send(sock, jid)`.
- **🔘 Native Flow Interactive Buttons**: Built-in support for Quick Reply (`cta_quick_reply`), Link (`cta_url`), Phone Call (`cta_call`), Copy Code (`cta_copy`), and Single Select List.
- **🎠 Interactive Multi-Card Carousel**: Swipeable multi-card carousels with individual headers, body text, footers, and native flow action buttons.
- **🧰 Developer Toolkit**: JID formatters/validators, media buffer/stream converters, message text extractors, human-readable file size and duration formatters.
- **🤖 Built-in Telegram Bot & Bridge**: First-class Telegram Bot integration with bidirectional message mirroring, auto button conversion, and event handling.
- **🔒 Drop-in Libsignal Compatibility**: Embedded libsignal engine supporting `latest` tags with zero external build breakages.

---

## 📦 Installation

Install via GitHub using the `latest` tag:

```bash
npm install github:dzytzy/alya-baileys#latest
```

Or from npm (when published):
```bash
npm install @diezyclutch/alya-baileys@latest
```

---

## 🚀 Quick Start

### 1. Basic WhatsApp Connection (CommonJS & ESM)

#### CommonJS:
```javascript
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@diezyclutch/alya-baileys');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('✅ Connected to WhatsApp!');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;
        const jid = msg.key.remoteJid;
        
        await sock.sendMessage(jid, { text: 'Hello from Alya Baileys! 🌸' }, { quoted: msg });
    });
}

startBot();
```

#### ESM:
```javascript
import makeWASocket, { useMultiFileAuthState, DisconnectReason, MessageBuilder, Button, Carousel, A2UI, Toolkit } from '@diezyclutch/alya-baileys';

// Same clean API!
```

---

## 🎛️ Interactive Message Builder (MB)

```javascript
const { MB } = require('@diezyclutch/alya-baileys');

const msg = new MB()
    .setHeader("🌸 ALYA BAILEYS INTERACTIVE")
    .setBody("Welcome to the next generation of WhatsApp Bot Development!")
    .setFooter("Powered by @diezyclutch/alya-baileys")
    .addQuickReply("Ping 🏓", "cmd_ping")
    .addUrl("Visit GitHub 🌐", "https://github.com/dzytzy/alya-baileys")
    .addCopy("Copy Token 📋", "ALYA_PRO_KEY_2026")
    .addCall("Customer Service 📞", "+6283165835004");

await msg.send(sock, jid, { quoted: m });
```

---

## 🎠 Interactive Carousel

```javascript
const { CarouselBuilder } = require('@diezyclutch/alya-baileys');

const carousel = new CarouselBuilder()
    .setHeader("Featured Products")
    .setBody("Swipe through our top catalog items:")
    .setFooter("DiezyClutch Store")
    .addCard({
        header: "Product 1: VPS Premium",
        body: "High-spec 8-core Cloud Server with 99.9% uptime SLA.",
        footer: "Starting from $10/mo",
        buttons: [
            { type: "url", text: "Order Now", url: "https://example.com/vps" }
        ]
    })
    .addCard({
        header: "Product 2: WhatsApp Bot Hosting",
        body: "Zero-downtime containerized Baileys runtime environment.",
        footer: "Starting from $5/mo",
        buttons: [
            { type: "quick_reply", text: "Get Details", id: "bot_info" }
        ]
    });

await carousel.send(sock, jid, { quoted: m });
```

---

## 🧩 Meta A2UI Widget Builder

```javascript
const { A2UIBuilder } = require('@diezyclutch/alya-baileys');

const a2ui = new A2UIBuilder()
    .setTitle("User Profile Form")
    .setBody("Interactive A2UI Card Surface")
    .setFooter("Meta Conversational UI")
    .addCard([
        { type: "text", text: "👤 John Doe", weight: "bold", size: "large" },
        { type: "text", text: "Rank: Diamond Member", size: "medium" }
    ])
    .addRow([
        { type: "text", text: "Balance: $1,250.00", weight: "bold" },
        { type: "text", text: "Points: 4,500 ⭐" }
    ]);

await a2ui.send(sock, jid, m);
```

---

## 🤖 Built-in Telegram Bot & Bridge

Bridge WhatsApp conversations directly to your Telegram chat or run standalone Telegram bots:

```javascript
const { makeTelegramBot, makeTelegramBridge } = require('@diezyclutch/alya-baileys');

const tgBot = makeTelegramBot("YOUR_TELEGRAM_BOT_TOKEN");
tgBot.startPolling();

// Standalone Telegram Bot:
tgBot.on("command", async ({ command, args, message }) => {
    if (command === "/start") {
        await tgBot.sendMessage(message.chat.id, "Hello from Alya Telegram Bot! ✈️");
    }
});

// Bidirectional Bridge with WhatsApp:
const bridge = makeTelegramBridge(sock, tgBot, {
    telegramChatId: "-1001234567890", // Your Telegram Group / Channel
    forwardWhatsAppToTelegram: true,
    forwardTelegramToWhatsApp: true
});
```

---

## 👑 Developer & Contact

- **Author**: DiezyClutch (`rnzdzy`)
- **Instagram**: [rnzdzy_](https://instagram.com/rnzdzy_)
- **Telegram**: [@seannanvy](https://t.me/seannanvy)
- **WhatsApp**: [wa.me/6283165835004](https://wa.me/6283165835004)

---

## 📄 License

MIT License © 2026 DiezyClutch.
