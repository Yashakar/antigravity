import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTenantSafeDb } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { ServerConsole } from "@/components/server-console"

export default async function DashboardPage() {
    // Mock data to bypass "Can't reach database server at 'localhost:5432'" error
    // Restore real DB fetch once your database is running:
    // const db = await getTenantSafeDb()
    // const servers = await db.server.findMany()

    const servers = [
        { id: "srv-01", name: "Web Server 01", status: "online", tenantId: "tenant-1" },
        { id: "srv-02", name: "Db Server 01", status: "online", tenantId: "tenant-1" },
        { id: "srv-03", name: "Cache Redis", status: "offline", tenantId: "tenant-1" },
    ]

    return (
        <div className="flex flex-col gap-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Servers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{servers.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Online
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {servers.filter((s: any) => s.status === 'online').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Issues
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {servers.filter((s: any) => s.status === 'offline').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>System Health - Managed Servers</CardTitle>
                </CardHeader>
                <CardContent>
                    {servers.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">No servers found.</div>
                    ) : (
                        <div className="space-y-4">
                            {servers.map((server: any) => (
                                <div key={server.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium">{server.name}</p>
                                        <p className="text-sm text-gray-500">ID: {server.id}</p>
                                    </div>
                                    <Badge variant={server.status === 'online' ? 'default' : 'destructive'}
                                        className={server.status === 'online' ? 'bg-green-500 hover:bg-green-600' : ''}>
                                        {server.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="mt-6">
                <ServerConsole servers={servers.map((s: any) => ({ id: s.id, name: s.name }))} />
            </div>
        </div>
    )
}
