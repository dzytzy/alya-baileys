import { EventEmitter } from "events";

export declare class TelegramBot extends EventEmitter {
    token: string;
    apiBase: string;
    polling: boolean;
    lastUpdateId: number;

    constructor(token: string, options?: Record<string, any>);
    request(method: string, payload?: Record<string, any>): Promise<any>;
    getMe(): Promise<any>;
    sendMessage(chatId: string | number, text: string, options?: Record<string, any>): Promise<any>;
    sendButtons(chatId: string | number, text: string, inlineKeyboard?: any[], options?: Record<string, any>): Promise<any>;
    sendPhoto(chatId: string | number, photo: string | Buffer, caption?: string, options?: Record<string, any>): Promise<any>;
    sendDocument(chatId: string | number, document: string | Buffer, caption?: string, options?: Record<string, any>): Promise<any>;
    startPolling(intervalMs?: number): void;
    stopPolling(): void;
}

export declare function makeTelegramBot(token: string, options?: Record<string, any>): TelegramBot;

export declare class TelegramBridge extends EventEmitter {
    sock: any;
    tgBot: TelegramBot;
    options: {
        forwardWhatsAppToTelegram?: boolean;
        forwardTelegramToWhatsApp?: boolean;
        telegramChatId?: string | number | null;
        whatsAppJid?: string | null;
    };

    constructor(sock: any, tgBot: TelegramBot, options?: Record<string, any>);
    handleWhatsAppMessage(waMsg: any): Promise<void>;
    handleTelegramMessage(tgMsg: any): Promise<void>;
    convertButtonsToTelegram(buttons?: any[]): any[];
    convertTelegramButtonsToWhatsApp(inlineKeyboard?: any[]): any[];
}

export declare function makeTelegramBridge(sock: any, tgBot: TelegramBot, options?: Record<string, any>): TelegramBridge;

export default TelegramBot;
