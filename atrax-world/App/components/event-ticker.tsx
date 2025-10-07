"use client"

import { Card } from "@/components/ui/card"
import { Activity } from "lucide-react"

// Mock event data
const MOCK_EVENTS = [
  { type: "donation", user: "7xKX...9mPq", amount: 2.5, timestamp: Date.now() - 5000 },
  { type: "item", user: "4nBv...2kLp", item: 3, timestamp: Date.now() - 15000 },
  { type: "donation", user: "9wQz...5tRx", amount: 1.0, timestamp: Date.now() - 30000 },
]

export function EventTicker() {
  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="h-4 w-4 text-green-400" />
          <span className="text-sm font-semibold text-white">Recent Activity</span>
        </div>
        <div className="space-y-2">
          {MOCK_EVENTS.map((event, i) => (
            <div key={i} className="text-sm text-gray-400 flex items-center gap-2">
              <span className="text-cyan-400 font-mono">{event.user}</span>
              {event.type === "donation" ? (
                <span>
                  donated <span className="text-green-400 font-semibold">{event.amount} SOL</span>
                </span>
              ) : (
                <span>
                  chose <span className="text-purple-400 font-semibold">Item {event.item}</span>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
