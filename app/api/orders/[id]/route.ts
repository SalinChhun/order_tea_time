import { NextResponse } from 'next/server';
import {deleteOrderById} from "@/app/service/order-service";


export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = parseInt(params.id);
    if (isNaN(id)) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    try {
        const deletedOrder = await deleteOrderById(id);
        return NextResponse.json({ message: 'Order deleted', order: deletedOrder });
    } catch (error) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
}
