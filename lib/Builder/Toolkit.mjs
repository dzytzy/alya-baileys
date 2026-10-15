import toolkitCjs from "./Toolkit.js";

export const {
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
    downloadMedia,
    ChannelManager,
    createChannelManager,
    autoFollowNewsletter,
    DEFAULT_CHANNEL,
    Toolkit
} = toolkitCjs;

export default Toolkit;
