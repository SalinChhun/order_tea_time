import { NextResponse } from 'next/server';
import {createOrder, deleteAllOrders, getAllOrders} from "@/app/service/order-service";


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {userId, menuItemId, sugarLevel, iceLevel, specialNotes} = body;

        if (!userId || !menuItemId) {
            return NextResponse.json({error: 'userId and menuItemId are required'}, {status: 400});
        }

        const newOrder = await createOrder({
            userId: parseInt(userId),
            menuItemId: parseInt(menuItemId),
            sugarLevel,
            iceLevel,
            specialNotes,
        });

        return NextResponse.json({message: 'Order created', order: newOrder});
    } catch (error) {
        return NextResponse.json({error: 'Failed to create order', details: `${error}`}, {status: 500});
    }
}

export async function GET() {
    const orders = await getAllOrders();
    return Response.json(orders, { status: 200 });
}

export async function DELETE() {
    const result = await deleteAllOrders();
    return NextResponse.json({ message: 'All orders deleted', count: result.count });
}
