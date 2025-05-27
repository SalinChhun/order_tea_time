import { prisma } from '@/lib/prisma';
import {CreateUserResult, TelegramUserData} from "@/app/type/user";

export class UserService {
    static async registerUser(telegramUser: TelegramUserData, chatId: number): Promise<CreateUserResult> {
        try {
            //TODO: Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { username: chatId.toString() }
            });

            if (existingUser) {
                return {
                    success: false,
                    user: existingUser,
                    message: ``,
                    isExisting: true
                };
            }

            //TODO: Create new user
            const userName = telegramUser.first_name + (telegramUser.last_name ? ` ${telegramUser.last_name}` : '');

            const user = await prisma.user.create({
                data: {
                    username: chatId.toString(),
                    name: userName,
                },
            });

            return {
                success: true,
                user,
                message: `🎉 Welcome, ${userName}! You can now order Teatime.`,
                isExisting: false
            };

        } catch (error) {
            console.error('User service error:', error);
            return {
                success: false,
                message: '❌ Sorry, there was an error during registration. Please try again later.'
            };
        }
    }

    static async getUserByChatId(chatId: number) {
        try {
            return await prisma.user.findUnique({
                where: { username: chatId.toString() }
            });
        } catch (error) {
            console.error('Get user error:', error);
            return null;
        }
    }

    static async updateUser(chatId: number, data: Partial<{ name: string }>) {
        try {
            return await prisma.user.update({
                where: { username: chatId.toString() },
                data
            });
        } catch (error) {
            console.error('Update user error:', error);
            return null;
        }
    }
}