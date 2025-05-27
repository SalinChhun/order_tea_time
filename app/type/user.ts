export interface TelegramUserData {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
}

export interface CreateUserResult {
    success: boolean;
    user?: any;
    message: string;
    isExisting?: boolean;
}