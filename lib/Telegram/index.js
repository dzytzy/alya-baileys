"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

const { TelegramBot, makeTelegramBot } = require("./TelegramBot");
const { TelegramBridge, makeTelegramBridge } = require("./TelegramBridge");

module.exports = {
    TelegramBot,
    makeTelegramBot,
    TelegramBridge,
    makeTelegramBridge,
    default: TelegramBot
};
