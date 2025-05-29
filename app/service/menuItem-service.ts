
import { ItemCategory } from '@prisma/client';
import {prisma} from "@/lib/prisma";

export const getAllMenuItems = async () => {
    return prisma.menuItem.findMany();
};

export const getMenuItemById = async (id: number) => {
    return prisma.menuItem.findUnique({
        where: {id},
    });
};

export const createMenuItem = async ({
                                         name,
                                         image,
                                         category,
                                         description,
                                         isActive = true,
                                     }: {
    name: string;
    image?: string
    category: ItemCategory;
    description?: string;
    isActive?: boolean;
}) => {
    return prisma.menuItem.create({
        data: {
            name,
            image,
            category,
            description,
            isActive,
        },
    });
};

export const updateMenuItem = async (
    id: number,
    updates: {
        name?: string;
        image?: string
        category?: ItemCategory;
        description?: string;
        isActive?: boolean;
    }
) => {
    return prisma.menuItem.update({
        where: {id},
        data: updates,
    });
};

export const deleteMenuItem = async (id: number) => {
    return prisma.menuItem.delete({
        where: {id},
    });
};
