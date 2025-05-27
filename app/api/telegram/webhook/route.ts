import {NextRequest} from 'next/server';
import {sendTelegramMessage, sendTelegramMessageWithButtons} from '@/lib/telegram';
import {UserService} from "@/app/service/user-service";
import {TelegramCallbackQuery, TelegramUpdate} from "@/app/type/telegram";

export async function POST(request: NextRequest) {
    try {
        const update: TelegramUpdate & { callback_query?: TelegramCallbackQuery } = await request.json();
        console.log('Received Telegram update:', update);

        // Handle callback queries (button clicks)
        if (update.callback_query) {
            await handleCallbackQuery(update.callback_query);
            return Response.json({ok: true});
        }

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

        // Handle callback query (button click)
        if (messageText === '/menu') {
            await showMenuWithButtons(chatId);
        }

        return Response.json({ok: true});
    } catch (error) {
        console.error('Telegram webhook error:', error);
        return Response.json({error: 'Internal server error'}, {status: 500});
    }
}

async function showMenuWithButtons(chatId: number) {
    const message = "Welcome! Choose an option:";
    const buttons = [
        [
            { text: "Click Me 👆", callback_data: "button_clicked" },
            { text: "Profile 👤", callback_data: "show_profile" }
        ],
        [
            { text: "Settings ⚙️", callback_data: "show_settings" },
            { text: "Help ❓", callback_data: "show_help" }
        ]
    ];

    await sendTelegramMessageWithButtons(chatId, message, buttons);
}

async function handleCallbackQuery(callbackQuery: any) {
    const chatId = callbackQuery.message.chat.id;
    const userId = callbackQuery.from.id;
    const data = callbackQuery.callback_data;
    const messageId = callbackQuery.message.message_id;
    console.log(`Received callback query: ${data} from user ${userId}`);
    console.log(`Chat ID: ${chatId}, Message ID: ${messageId}`);
    console.log(`Button clicked: ${data} by user ${userId}`);

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