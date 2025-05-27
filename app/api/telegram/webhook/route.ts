import {NextRequest} from 'next/server';
import {sendInlineKeyboard, sendTelegramMessage} from '@/lib/telegram';
import {UserService} from "@/app/service/user-service";
import {TelegramUpdate} from "@/app/type/telegram";

export async function POST(request: NextRequest) {
    try {
        const update: TelegramUpdate = await request.json();
        console.log('Received Telegram update:', update);

        //TODO: Check if this is a message update
        if (!update.message || !update.message.from) {
            return Response.json({ok: true});
        }

        const telegramUser = update.message.from;
        const chatId = update.message.chat.id;
        const messageText = update.message.text;

        //TODO: Handle /start command or when user first connects
        if (messageText === '/start' || messageText === '/register') {
            console.log(`New user registration: ${telegramUser.first_name} (${telegramUser.id})`);
            console.log(`Chat ID: ${chatId}`);
            await handleUserRegistration(telegramUser, chatId);
        }

        // Handle callback queries (button clicks)
        if (update.callback_query) {
            const callbackQuery = update.callback_query;
            const chatId = callbackQuery.message?.chat.id;
            const data = callbackQuery.data;

            if (data === 'order_now' && chatId) {
                await handleOrderButton(chatId);
            }

            // Answer the callback query to remove loading state
            await answerCallbackQuery(callbackQuery.id);
        }


        return Response.json({ok: true});
    } catch (error) {
        console.error('Telegram webhook error:', error);
        return Response.json({error: 'Internal server error'}, {status: 500});
    }
}

async function handleOrderButton(chatId: number) {
    const webAppUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/order`;

    const keyboard = {
        inline_keyboard: [
            [
                {
                    text: "🛒 Open Teatime Menu",
                    web_app: { url: webAppUrl }
                }
            ]
        ]
    };

    await sendInlineKeyboard(
        chatId,
        "🍵 Click the button below to open our menu and place your order!",
        keyboard
    );
}

async function answerCallbackQuery(callbackQueryId: string) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            callback_query_id: callbackQueryId,
        }),
    });
}


async function handleUserRegistration(telegramUser: any, chatId: number) {
    try {
        const result = await UserService.registerUser(telegramUser, chatId);
        if (result.success) {
            await sendTelegramMessage(chatId, result.message);
        }
    } catch (error) {
        console.error('User registration handler error:', error);
        await sendTelegramMessage(
            chatId,
            '❌ Sorry, there was an unexpected error. Please try again later.'
        );
    }
}