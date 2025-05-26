import { NextRequest } from 'next/server';
// import { prisma } from '@/lib/prisma';
import {sendTelegramMessage, TelegramUpdate} from '@/lib/telegram';

export async function POST(request: NextRequest) {
    try {
        const update: TelegramUpdate = await request.json();

        // Check if this is a message update
        if (!update.message || !update.message.from) {
            return Response.json({ ok: true });
        }

        const telegramUser = update.message.from;
        const chatId = update.message.chat.id;
        const messageText = update.message.text;

        // Handle /start command or when user first connects
        if (messageText === '/start' || messageText === '/register') {
            console.log(`New user registration: ${telegramUser.first_name} (${telegramUser.id})`);
            console.log(`Chat ID: ${chatId}`);
            // await handleUserRegistration(telegramUser, chatId);
            await sendTelegramMessage(
                chatId,
                `👋 Hello ${telegramUser.first_name}!\n\n` +
                `Welcome to our Telegram bot! Please type /help to see available commands.`
            );
        } else {
            // Handle other messages
            await handleRegularMessage(telegramUser, chatId, messageText);
        }

        return Response.json({ ok: true });
    } catch (error) {
        console.error('Telegram webhook error:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// async function handleUserRegistration(telegramUser: any, chatId: number) {
//     try {
//         // Check if user already exists
//         const existingUser = await prisma.user.findUnique({
//             where: { telegramId: telegramUser.id.toString() }
//         });
//
//         if (existingUser) {
//             await sendTelegramMessage(
//                 chatId,
//                 `Welcome back, ${existingUser.name}! You're already registered.`
//             );
//             return;
//         }
//
//         // Create new user
//         const userName = telegramUser.first_name + (telegramUser.last_name ? ` ${telegramUser.last_name}` : '');
//         const email = telegramUser.username ? `${telegramUser.username}@telegram.user` : `user${telegramUser.id}@telegram.user`;
//
//         const newUser = await prisma.user.create({
//             data: {
//                 name: userName,
//                 email: email,
//                 telegramId: telegramUser.id.toString(),
//                 telegramUsername: telegramUser.username || null,
//             },
//         });
//
//         await sendTelegramMessage(
//             chatId,
//             `🎉 Welcome ${userName}!\n\nYou have been successfully registered!\n\n` +
//             `Your details:\n` +
//             `• Name: ${newUser.name}\n` +
//             `• Email: ${newUser.email}\n` +
//             `• Telegram ID: ${newUser.telegramId}\n\n` +
//             `You can now use all bot features!`
//         );
//
//     } catch (error) {
//         console.error('User registration error:', error);
//         await sendTelegramMessage(
//             chatId,
//             '❌ Sorry, there was an error during registration. Please try again later.'
//         );
//     }
// }

async function handleRegularMessage(telegramUser: any, chatId: number, messageText?: string) {
    try {
        // Check if user is registered
        // const user = await prisma.user.findUnique({
        //     where: { telegramId: telegramUser.id.toString() }
        // });
        //
        // if (!user) {
        //     await sendTelegramMessage(
        //         chatId,
        //         '👋 Hello! It looks like you\'re not registered yet.\n\n' +
        //         'Please type /start or /register to create your account.'
        //     );
        //     return;
        // }

        // Handle different commands for registered users
        switch (messageText) {
            case '/profile':
                await sendTelegramMessage(
                    chatId,
                    `📋 Your Profile:\n\n`
                    // `• Name: ${user.name}\n` +
                    // `• Email: ${user.email}\n` +
                    // `• Telegram ID: ${user.telegramId}\n` +
                    // `• Registered: ${user.createdAt.toDateString()}`
                );
                break;

            case '/help':
                await sendTelegramMessage(
                    chatId,
                    `🤖 Available Commands:\n\n` +
                    `/start - Register account\n` +
                    `/profile - View your profile\n` +
                    `/help - Show this help message\n\n`
                );
                break;

            default:
                await sendTelegramMessage(
                    chatId,
                    `I received your message: "${messageText}"\n\n` +
                    `Type /help to see available commands.`
                );
        }

    } catch (error) {
        console.error('Message handling error:', error);
        await sendTelegramMessage(
            chatId,
            '❌ Sorry, there was an error processing your message.'
        );
    }
}