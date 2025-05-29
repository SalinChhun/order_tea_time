import { NextResponse } from 'next/server';
import {createMenuItem, getAllMenuItems} from "@/app/service/menuItem-service";


export async function GET() {
    const items = await getAllMenuItems();
    return NextResponse.json(items);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, category, description, isActive } = body;

        if (!name || !category) {
            return NextResponse.json({ error: 'name and category are required' }, { status: 400 });
        }

        const newItem = await createMenuItem({ name, category, description, isActive });
        return NextResponse.json(newItem);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create menu item', details: `${error}` }, { status: 500 });
    }
}
