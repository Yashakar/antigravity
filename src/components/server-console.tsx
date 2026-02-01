"use client"

import { useState } from "react"
import { executeRemoteCommand } from "@/actions/ssh-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Terminal } from "lucide-react"

interface ConsoleProps {
    servers: { id: string, name: string }[]
}

export function ServerConsole({ servers }: ConsoleProps) {
    const [selectedServer, setSelectedServer] = useState(servers[0]?.id || "")
    const [command, setCommand] = useState("")
    const [output, setOutput] = useState("")
    const [loading, setLoading] = useState(false)

    const handleExecute = async () => {
        if (!selectedServer || !command) return

        setLoading(true)
        setOutput("Executing...")

        try {
            const result = await executeRemoteCommand(selectedServer, command)
            setOutput(result.output)
        } catch (e) {
            setOutput("Error executing command")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Terminal className="w-5 h-5" />
                    Remote Console
                </CardTitle>
                <p className="text-xs text-red-500 font-medium">
                    Warning: Commands executed here run directly on the remote server via SSH.
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={selectedServer}
                        onChange={(e) => setSelectedServer(e.target.value)}
                    >
                        {servers.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-2">
                    <Input
                        placeholder="Command (e.g. whoami)"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
                    />
                    <Button onClick={handleExecute} disabled={loading}>
                        {loading ? "Running..." : "Run"}
                    </Button>
                </div>
                <div className="bg-black text-green-400 p-4 rounded-md font-mono text-sm h-64 overflow-auto whitespace-pre-wrap">
                    {output || "> Ready..."}
                </div>
            </CardContent>
        </Card>
    )
}
