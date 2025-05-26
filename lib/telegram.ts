export interface TelegramUser {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
}

export interface TelegramMessage {
    message_id: number;
    from: TelegramUser;
    chat: {
        id: number;
        type: string;
    };
    date: number;
    text?: string;
}

export interface TelegramUpdate {
    update_id: number;
    message?: TelegramMessage;
}

// Send message via Telegram Bot API
export async function sendTelegramMessage(chatId: number, text: string) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
        throw new Error('TELEGRAM_BOT_TOKEN is not set');
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
        }),
    });

    if (!response.ok) {
        throw new Error(`Telegram API error: ${response.statusText}`);
    }

    return response.json();
}

// Set webhook for your bot
export async function setTelegramWebhook(webhookUrl: string) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            url: webhookUrl,
        }),
    });

    return response.json();
}