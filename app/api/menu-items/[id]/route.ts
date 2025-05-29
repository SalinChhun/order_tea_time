import { NextResponse } from 'next/server';
import { deleteMenuItem, getMenuItemById, updateMenuItem } from '@/app/service/menuItem-service';

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
    try {
        const deleted = await deleteMenuItem(id);
        return NextResponse.json({ message: 'Deleted', item: deleted });
    } catch {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
