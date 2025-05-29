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
    userDisplay: string;
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

export const deleteAllOrders = async () => {
    return prisma.order.deleteMany();
};

export const deleteOrderById = async (id: number) => {
    return prisma.order.delete({
        where: {id},
    });
};
