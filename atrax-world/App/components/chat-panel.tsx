"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export function ChatPanel() {
  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-400" />
          <CardTitle className="text-white">Chat</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-32 flex items-center justify-center text-gray-500 text-sm">
          Chat placeholder - Coming soon
        </div>
      </CardContent>
    </Card>
  )
}
