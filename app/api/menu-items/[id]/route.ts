import { NextResponse } from 'next/server';
import { deleteMenuItem, getMenuItemById, updateMenuItem } from '@/app/service/menuItem-service';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
    const id = parseInt(request.url.split('/').pop() || '');
    const item = await getMenuItemById(id);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(item);
}

export async function PUT(request: Request) {
    const id = parseInt(request.url.split('/').pop() || '');
    const updates = await request.json();
    try {
        const updated = await updateMenuItem(id, updates);
        return NextResponse.json(updated);
    } catch {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const id = parseInt(request.url.split('/').pop() || '');

    if (isNaN(id)) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    try {
        const deleted = await deleteMenuItem(id);
        return NextResponse.json({ message: 'Deleted', item: deleted });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2003'
        ) {
            return NextResponse.json(
                { error: 'This product is already in use and cannot be deleted' },
                { status: 400 }
            );
        }

        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
