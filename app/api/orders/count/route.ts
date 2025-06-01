import {getOrderCountsByProduct} from "@/app/service/order-service";
import {NextResponse} from "next/server";


export async function GET() {
    try {
        const orderCountsData = await getOrderCountsByProduct();

        return NextResponse.json({
            success: true,
            ...orderCountsData
        });

    } catch (error) {
        console.error('Error fetching order counts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch order counts', details: `${error}` },
            { status: 500 }
        );
    }
}