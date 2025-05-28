
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

//TODO: Set Menu Button for your bot
export async function setMenuButton(chatId: number) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    console.log(`Setting menu button for chat ID: ${chatId}`);
    if (!botToken) {
        throw new Error('TELEGRAM_BOT_TOKEN is not set');
    }

    const webAppUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/home?session=${chatId}`;

    const response = await fetch(`https://api.telegram.org/bot${botToken}/setChatMenuButton`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            menu_button: {
                type: 'web_app',
                text: 'កម្មង់ | Order',
                web_app: {
                    url: webAppUrl,
                },
            },
        }),
    });

    if (!response.ok) {
        console.error('Failed to set menu button:', await response.text());
    }

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