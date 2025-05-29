import {NextRequest} from 'next/server';
import {sendTelegramMessage, setMenuButton} from '@/lib/telegram';
import {UserService} from "@/app/service/user-service";
import {TelegramUpdate} from "@/type/telegram";

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

        return Response.json({ok: true});
    } catch (error) {
        console.error('Telegram webhook error:', error);
        return Response.json({error: 'Internal server error'}, {status: 500});
    }
}

async function handleUserRegistration(telegramUser: any, chatId: number) {
    try {
        const result = await UserService.registerUser(telegramUser, chatId);
        if (result.success) {
            await sendTelegramMessage(chatId, result.message);
            await setMenuButton(chatId);
        }
    } catch (error) {
        console.error('User registration handler error:', error);
        await sendTelegramMessage(
            chatId,
            '❌ Sorry, there was an unexpected error. Please try again later.'
        );
    }
}
