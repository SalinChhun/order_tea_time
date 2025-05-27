// @ts-nocheck
import {PrismaClient} from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? new PrismaClient(
    {
        log: process.env.NODE_ENV === 'production' ? [] : ['query', 'info', 'warn', 'error'],
    }
);

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
})

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
})

process.on('beforeExit', async () => {
    await prisma.$disconnect();
})

// let prisma: PrismaClient;
//
// if (process.env.NODE_ENV === 'production') {
//     prisma = new PrismaClient();
// } else {
//     if (!global.prisma) {
//         global.prisma = new PrismaClient();
//     }
//     prisma = global.prisma;
// }
//
// export default prisma;