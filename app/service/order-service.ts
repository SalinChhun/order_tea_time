import {prisma} from "@/lib/prisma";
import {$Enums, SugarLevel} from "@prisma/client";
import IceLevel = $Enums.IceLevel;
import {OrderCountByProduct, OrderCountSummary} from "@/type/order";


export const createOrder = async ({
                                      userId,
                                      userDisplay,
                                      menuItemId,
                                      sugarLevel = 'NO_SUGAR',
                                      iceLevel = 'NORMAL_ICE',
                                      specialNotes,
                                  }: {
    userId: number;
    userDisplay?: string;
    menuItemId: number;
    sugarLevel?: SugarLevel;
    iceLevel?: IceLevel;
    specialNotes?: string;
}) => {
    return prisma.order.create({
        data: {
            userId,
            menuItemId,
            userDisplay,
            sugarLevel,
            iceLevel,
            specialNotes,
        },
        include: {
            user: true,
            menuItem: true,
        },
    });
};

export const getAllOrders = async () => {
    return prisma.order.findMany({
        include: {
            user: true,
            menuItem: true,
        },
        orderBy: {
            orderDate: 'desc',
        },
    });
};

export const getOrderCountsByProduct = async (): Promise<OrderCountSummary> => {
    const orderCounts = await prisma.order.groupBy({
        by: ['menuItemId', 'sugarLevel', 'iceLevel'],
        _count: {
            id: true,
        },
    });

    // Fetch menu items with their categories
    const menuItemIds = [...new Set(orderCounts.map(order => order.menuItemId))];
    const menuItems = await prisma.menuItem.findMany({
        where: {
            id: {
                in: menuItemIds
            }
        },
        select: {
            id: true,
            name: true,
            image: true,
            category: true,
        }
    });

    // Create a map for quick lookup
    const menuItemMap = new Map(menuItems.map(item => [item.id, { name: item.name, image: item.image, category: item.category }]));

    // Transform the data to match the required format
    const result = orderCounts.map(order => ({
        item: menuItemMap.get(order.menuItemId)?.name || 'Unknown Item',
        category: menuItemMap.get(order.menuItemId)?.category || 'Unknown Category', // Add category
        image: menuItemMap.get(order.menuItemId)?.image || '',
        sugar: order.sugarLevel,
        ice: order.iceLevel,
        total: order._count.id,
    }));

    // Group by item name and sum totals
    const groupedResult = result.reduce((acc, curr) => {
        const existingItem = acc.find(item => item.item === curr.item);
        if (existingItem) {
            existingItem.total += curr.total;
            if (!existingItem.details) {
                existingItem.details = [];
            }
            existingItem.details.push({
                sugar: curr.sugar,
                ice: curr.ice,
                count: curr.total
            });
        } else {
            acc.push({
                item: curr.item,
                total: curr.total,
                category: curr.category,
                image: curr.image,
                details: [{
                    sugar: curr.sugar,
                    ice: curr.ice,
                    count: curr.total
                }]
            });
        }
        return acc;
    }, [] as OrderCountByProduct[]);

    // Sort by total count descending
    groupedResult.sort((a, b) => b.total - a.total);

    return {
        data: groupedResult,
        totalOrders: result.reduce((sum, item) => sum + item.total, 0)
    };
};

export const updateOrder = async (
    id: number,
    {
        userId,
        userDisplay,
        menuItemId,
        sugarLevel,
        iceLevel,
        specialNotes,
    }: {
        userId?: number;
        userDisplay?: string;
        menuItemId?: number;
        sugarLevel?: SugarLevel;
        iceLevel?: IceLevel;
        specialNotes?: string;
    }
) => {

    // Validate that userId exists if provided
    if (userId) {
        const userExists = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!userExists) {
            throw new Error(`User with ID ${userId} does not exist`);
        }
    }

    // Validate that menuItemId exists if provided
    if (menuItemId) {
        const menuItemExists = await prisma.menuItem.findUnique({
            where: { id: menuItemId }
        });
        if (!menuItemExists) {
            throw new Error(`Menu item with ID ${menuItemId} does not exist`);
        }
    }

    return prisma.order.update({
        where: { id },
        data: {
            ...(userId && { userId }),
            ...(userDisplay !== undefined && { userDisplay }),
            ...(menuItemId && { menuItemId }),
            ...(sugarLevel && { sugarLevel }),
            ...(iceLevel && { iceLevel }),
            ...(specialNotes !== undefined && { specialNotes }),
        },
        include: {
            user: true,
            menuItem: true,
        },
    });
};

export const deleteAllOrders = async () => {
    return prisma.order.deleteMany();
};

export const deleteOrderById = async (id: number) => {
    return prisma.order.delete({
        where: {id},
    });
};
