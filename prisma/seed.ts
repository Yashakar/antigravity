import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("Seeding database...")

    // Create Tenant
    const tenant = await prisma.tenant.create({
        data: {
            name: "Acme Corp",
        }
    })
    console.log("Created tenant:", tenant.id)

    // Create Servers for Tenant
    await prisma.server.createMany({
        data: [
            { name: "Web Server 01", status: "online", tenantId: tenant.id, ipAddress: "192.168.1.10", username: "admin", password: "password123" },
            { name: "Db Server 01", status: "online", tenantId: tenant.id, ipAddress: "192.168.1.11", username: "dbadmin", password: "securepass" },
            { name: "Cache Redis", status: "offline", tenantId: tenant.id }, // No SSH for this one
        ]
    })

    // Create another tenant to verify isolation
    const tenant2 = await prisma.tenant.create({
        data: { name: "Globex Inc" }
    })
    await prisma.server.create({
        data: { name: "Globex Server", status: "online", tenantId: tenant2.id }
    })

    console.log("Seeding complete.")
    // Note: For NextAuth mock, we hardcoded tenant-1. We need to print the ID so user can update auth.ts if they want, 
    // OR we can update auth.ts to look up by email match.
    // For this scaffold, I'll update auth.ts to just hardcode the ID we just created?
    // Actually, I'll just print them.
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
