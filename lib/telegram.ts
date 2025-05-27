
//TODO: Send message via Telegram Bot API
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

export async function sendTelegramMessageWithButtons(
    chatId: number,
    text: string,
    buttons: Array<Array<{text: string, callback_data: string}>>
) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: buttons
            }
        }),
    });

    return response.json();
}

//TODO: Set webhook for your bot
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