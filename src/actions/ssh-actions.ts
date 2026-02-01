"use server"

import { getTenantSafeDb } from "@/lib/db"
import { NodeSSH } from "node-ssh"

export async function executeRemoteCommand(serverId: string, command: string) {
    const db = await getTenantSafeDb()

    // 1. Audit Log (Simulated console log for now)
    console.log(`[AUDIT] Tenant: ${db.tenantId}, Server: ${serverId}, Command: ${command}`)

    // 2. Simple Command Blocklist (Hardening)
    const blocklist = [/;\s*rm/i, /\|\s*rm/i, /&\s*rm/i, />\s*\/etc\//i]
    if (blocklist.some(pattern => pattern.test(command))) {
        return { success: false, output: "Error: Dangerous command pattern detected and blocked." }
    }

    // --- RESTORING REAL LOGIC WITH HARDENING ---
    const server = await db.server.findFirst({
        where: { id: serverId }
    })

    if (!server) {
        return { success: false, output: "Server not found or access denied." }
    }

    if (!server.ipAddress || !server.username || !server.password) {
        return { success: false, output: "Missing SSH credentials for this server." }
    }

    const ssh = new NodeSSH()

    try {
        await ssh.connect({
            host: server.ipAddress,
            username: server.username,
            password: server.password,
        })

        const result = await ssh.execCommand(command)

        return {
            success: true,
            output: result.stdout || result.stderr
        }

    } catch (error: any) {
        return {
            success: false,
            output: `SSH Connection Failed: ${error.message}`
        }
    } finally {
        ssh.dispose()
    }
}
