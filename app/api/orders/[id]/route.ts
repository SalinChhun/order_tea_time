import { NextResponse } from 'next/server';
import {deleteOrderById, updateOrder} from '@/app/service/order-service';
import {Prisma} from "@prisma/client";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const { userId, userDisplay, menuItemId, sugarLevel, iceLevel, specialNotes } = body;

        // Await the params Promise
        const resolvedParams = await params;
        const orderId = parseInt(resolvedParams.id);

        if (isNaN(orderId)) {
            return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
        }

        const updatedOrder = await updateOrder(orderId, {
            userId: userId ? parseInt(userId) : undefined,
            userDisplay,
            menuItemId: menuItemId ? parseInt(menuItemId) : undefined,
            sugarLevel,
            iceLevel,
            specialNotes,
        });

        return NextResponse.json({ message: 'Order updated', order: updatedOrder });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025'
        ) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        return NextResponse.json(
            { error: 'Failed to update order', details: `${error}` },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Await the params Promise
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const deletedOrder = await deleteOrderById(id);
        return NextResponse.json({ message: 'Order deleted', order: deletedOrder });
    } catch (error) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
}