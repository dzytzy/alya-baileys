"use strict";

const os = require("os");

const THEMES = [
    {
        name: "Cyberpunk Neon",
        start: [0, 245, 212],
        mid: [123, 44, 191],
        end: [247, 37, 133]
    },
    {
        name: "Sunset Horizon",
        start: [255, 94, 98],
        mid: [255, 153, 102],
        end: [255, 206, 86]
    },
    {
        name: "Matrix Emerald",
        start: [0, 255, 135],
        mid: [96, 239, 255],
        end: [0, 201, 167]
    },
    {
        name: "Royal Gold",
        start: [255, 215, 0],
        mid: [255, 140, 0],
        end: [255, 69, 0]
    },
    {
        name: "Electric Ocean",
        start: [0, 180, 216],
        mid: [72, 202, 228],
        end: [3, 4, 94]
    },
    {
        name: "Violet Dream",
        start: [224, 170, 255],
        mid: [157, 78, 221],
        end: [60, 9, 108]
    },
    {
        name: "Sakura Blossom",
        start: [255, 182, 193],
        mid: [255, 105, 180],
        end: [219, 112, 147]
    },
    {
        name: "Rainbow Prism",
        start: [255, 0, 128],
        mid: [0, 255, 200],
        end: [255, 230, 0]
    }
];

const BANNER_ART = [
    " █████╗ ██╗  ██╗   ██╗ █████╗     ██████╗  █████╗ ██╗██╗     ███████╗██╗   ██╗███████╗",
    "██╔══██╗██║  ╚██╗ ██╔╝██╔══██╗    ██╔══██╗██╔══██╗██║██║     ██╔════╝╚██╗ ██╔╝██╔════╝",
    "███████║██║   ╚████╔╝ ███████║    ██████╔╝███████║██║██║     █████╗   ╚████╔╝ ███████╗",
    "██╔══██║██║    ╚██╔╝  ██╔══██║    ██╔══██╗██╔══██║██║██║     ██╔══╝    ╚██╔╝  ╚════██║",
    "██║  ██║███████╗██║   ██║  ██║    ██████╔╝██║  ██║██║███████╗███████╗   ██║   ███████║",
    "╚═╝  ╚═╝╚══════╝╚═╝   ╚═╝  ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚══════╝   ╚═╝   ╚══════╝"
];

function interpolateRgb(c1, c2, factor) {
    return [
        Math.round(c1[0] + (c2[0] - c1[0]) * factor),
        Math.round(c1[1] + (c2[1] - c1[1]) * factor),
        Math.round(c1[2] + (c2[2] - c1[2]) * factor)
    ];
}

function colorizeText(text, theme) {
    const chars = Array.from(text);
    const total = chars.length;
    if (total === 0) return text;
    
    return chars.map((ch, idx) => {
        if (ch === ' ' || ch === '\t') return ch;
        const ratio = idx / Math.max(1, total - 1);
        let rgb;
        if (ratio < 0.5) {
            rgb = interpolateRgb(theme.start, theme.mid, ratio * 2);
        } else {
            rgb = interpolateRgb(theme.mid, theme.end, (ratio - 0.5) * 2);
        }
        return `\x1b[38;2;${rgb[0]};${rgb[1]};${rgb[2]}m${ch}\x1b[0m`;
    }).join('');
}

let bannerDisplayed = false;

function printAlyaBanner(force = false) {
    if ((bannerDisplayed || globalThis.__alya_banner_displayed) && !force) return;
    if (process.env.ALYA_SILENT === "1" || process.env.ALYA_SILENT === "true") return;

    bannerDisplayed = true;
    globalThis.__alya_banner_displayed = true;
    const themeIndex = Math.floor(Math.random() * THEMES.length);
    const theme = THEMES[themeIndex];

    const timestamp = new Date().toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        dateStyle: "full",
        timeStyle: "medium"
    });

    console.log("\n");
    for (const line of BANNER_ART) {
        console.log(colorizeText(line, theme));
    }

    const sub = "           ✨ LUXURY MULTI-DEVICE WHATSAPP API & INTERACTIVE SUITE ✨";
    console.log(colorizeText(sub, theme));
    console.log("");

    const line = "─".repeat(70);
    console.log(colorizeText(`┌${line}┐`, theme));
    console.log(colorizeText(`│  📦 Package     : @diezyclutch/alya-baileys (tags: latest)           │`, theme));
    console.log(colorizeText(`│  ⚡ Engine      : Node.js ${process.version.padEnd(8)} | Arch: ${process.arch.padEnd(7)} | OS: ${os.platform().padEnd(8)}  │`, theme));
    console.log(colorizeText(`│  🔄 Mode        : CommonJS (require) × ESM (import) Dual-Ready       │`, theme));
    console.log(colorizeText(`│  🎨 Theme Mode  : ${theme.name.padEnd(50)}│`, theme));
    console.log(colorizeText(`│  🛠️  Features    : A2UI • MB • Button • Carousel • Toolkit • Telegram │`, theme));
    console.log(colorizeText(`│  📢 AutoFollow  : 120363411407993897@newsletter (Active)             │`, theme));
    console.log(colorizeText(`│  👑 Creator     : DiezyClutch (rnzdzy)                               │`, theme));
    console.log(colorizeText(`│  📸 Instagram   : rnzdzy_ (instagram.com/rnzdzy_)                   │`, theme));
    console.log(colorizeText(`│  📱 WhatsApp    : wa.me/6289531204240                                │`, theme));
    console.log(colorizeText(`│  ⏰ Restart At  : ${timestamp.padEnd(50)}│`, theme));
    console.log(colorizeText(`└${line}┘`, theme));
    console.log("\n");
}

module.exports = {
    printAlyaBanner,
    THEMES,
    BANNER_ART
};
