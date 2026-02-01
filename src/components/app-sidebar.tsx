"use client"

import Link from "next/link"
import { LayoutDashboard, Server, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function AppSidebar({ className }: SidebarProps) {
    return (
        <div className={cn("pb-12 h-screen border-r bg-muted/40", className)}>
            <div className="space-y-4 py-4">
                <div className="px-4 py-2">
                    <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                        Antigrav
                    </h2>
                    <div className="space-y-1">
                        <Button asChild variant="secondary" className="w-full justify-start">
                            <Link href="/dashboard">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                System Health
                            </Link>
                        </Button>
                        <Button asChild variant="ghost" className="w-full justify-start">
                            <Link href="/dashboard/servers">
                                <Server className="mr-2 h-4 w-4" />
                                Managed Servers
                            </Link>
                        </Button>
                        <Button asChild variant="ghost" className="w-full justify-start">
                            <Link href="/dashboard/settings">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-4 left-0 w-full px-4">
                <Button variant="outline" className="w-full justify-start text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    )
}
