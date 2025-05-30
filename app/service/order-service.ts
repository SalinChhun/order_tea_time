import {prisma} from "@/lib/prisma";
import {$Enums, SugarLevel} from "@prisma/client";
import IceLevel = $Enums.IceLevel;


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
    });
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
