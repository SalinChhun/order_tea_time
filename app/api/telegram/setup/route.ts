import { setTelegramWebhook } from '@/lib/telegram';

export async function POST() {
    try {
        const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/telegram/webhook`;
        const result = await setTelegramWebhook(webhookUrl);
        return Response.json(result);
    } catch (error) {
        return Response.json({ error: 'Failed to set webhook' }, { status: 500 });
    }
}