import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({
    log: ['query', 'error', 'warn']
})

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export async function getTenantSafeDb() {
    const session = await auth()

    if (!session?.user?.email) {
        throw new Error("Unauthorized")
    }

    const tenantId = (session.user as any).tenantId

    if (!tenantId) {
        throw new Error("No tenant associated with user")
    }

    return {
        server: {
            findMany: (args?: any) => prisma.server.findMany({
                ...args,
                where: { ...args?.where, tenantId }
            }),
            findFirst: (args?: any) => prisma.server.findFirst({
                ...args,
                where: { ...args?.where, tenantId }
            }),
            create: (args: any) => prisma.server.create({
                ...args,
                data: { ...args.data, tenantId }
            }),
            // Add other methods as needed, ensuring tenantId is always enforced
        },
        // Expose other models similarly if needed
        tenantId
    }
}
