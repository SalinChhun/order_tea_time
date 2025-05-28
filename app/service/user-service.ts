import {prisma} from '@/lib/prisma';
import {CreateUserResult, TelegramUserData} from "@/app/type/user";
import {User} from "@prisma/client";

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

    static async getAllUsers(): Promise<User[]> {
        try {
            return await prisma.user.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } catch (error) {
            throw new Error(`Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    static async getUserById(id: number): Promise<User | null> {
        try {
            return await prisma.user.findUnique({
                where: {id},
                include: {
                    orders: true
                }
            });
        } catch (error) {
            throw new Error(`Failed to fetch user: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    static async getUserByUsername(username: string): Promise<User | null> {
        try {
            return await prisma.user.findUnique({
                where: {username},
                include: {
                    orders: true
                }
            });
        } catch (error) {
            throw new Error(`Failed to fetch user by username: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /*static async updateUser(data: UpdateUserData): Promise<User> {
        try {
            const updateData: Partial<CreateUserData> = {};

            if (data.username !== undefined) {
                updateData.username = data.username;
            }
            if (data.name !== undefined) {
                updateData.name = data.name;
            }

            const user = await prisma.user.update({
                where: { id: data.id },
                data: updateData,
            });
            return user;
        } catch (error) {
            throw new Error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }*/

    static async deleteUser(id: number): Promise<User> {
        try {
            return await prisma.user.delete({
                where: {id},
            });
        } catch (error) {
            throw new Error(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    static async checkUserExists(id: number): Promise<boolean> {
        try {
            const user = await prisma.user.findUnique({
                where: { id },
                select: { id: true }
            });
            return user !== null;
        } catch (error) {
            return false;
        }
    }
}