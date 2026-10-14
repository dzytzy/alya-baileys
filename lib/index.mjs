import cjsModule from "./index.js";

export const makeWASocket = cjsModule.makeWASocket || cjsModule.default;
export const proto = cjsModule.proto;

// Builder & Interactive Message Exports
export const {
    A2UI,
    A2UIBuilder,
    a2uiText,
    a2uiImage,
    a2uiColumn,
    a2uiRow,
    a2uiCard,
    a2uiWidget,
    a2uiSurface,
    sendA2UI,
    Button,
    ButtonV2,
    ButtonBuilder,
    quickReply,
    url,
    call,
    copy,
    singleSelect,
    sendLocation,
    createButtons,
    createButtonMessage,
    Carousel,
    CarouselBuilder,
    createCarouselCard,
    createCarouselMessage,
    Toolkit,
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
    downloadMedia,
    bufferToStream,
    streamToBuffer,
    formatBytes,
    formatDuration,
    generateId,
    MessageBuilder,
    MB,
    TelegramBot,
    makeTelegramBot,
    TelegramBridge,
    makeTelegramBridge,
    printAlyaBanner
} = cjsModule;

// Re-export common Baileys functions
export const {
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    Browsers,
    delay,
    generateForwardMessageContent,
    generateWAMessage,
    generateWAMessageFromContent,
    generateWAMessageFromContentV2,
    prepareWAMessageMedia,
    areJidsSameUser,
    jidDecode,
    jidNormalizedUser,
    downloadContentFromMessage,
    DEFAULT_CONNECTION_CONFIG
} = cjsModule;

export default makeWASocket;
