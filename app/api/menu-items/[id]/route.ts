import { NextResponse } from 'next/server';
import {deleteMenuItem, getMenuItemById, updateMenuItem} from "@/app/service/menuItem-service";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id);
    const item = await getMenuItemById(id);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(item);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id);
    const updates = await req.json();
    try {
        const updated = await updateMenuItem(id, updates);
        return NextResponse.json(updated);
    } catch {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id);
    try {
        const deleted = await deleteMenuItem(id);
        return NextResponse.json({ message: 'Deleted', item: deleted });
    } catch {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
