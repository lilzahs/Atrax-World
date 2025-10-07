"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy } from "lucide-react"

// Placeholder leaderboard data
const MOCK_LEADERBOARD = [
  { address: "7xKX...9mPq", amount: 12.5, rank: 1 },
  { address: "4nBv...2kLp", amount: 8.3, rank: 2 },
  { address: "9wQz...5tRx", amount: 5.7, rank: 3 },
  { address: "2hYm...8cNk", amount: 3.2, rank: 4 },
  { address: "6pFd...1vWj", amount: 1.8, rank: 5 },
]

export function Leaderboard() {
  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          <CardTitle className="text-white">Top Donors</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {MOCK_LEADERBOARD.map((entry) => (
            <div key={entry.address} className="flex items-center justify-between py-2 border-b border-white/5">
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-bold ${
                    entry.rank === 1
                      ? "text-yellow-400"
                      : entry.rank === 2
                        ? "text-gray-300"
                        : entry.rank === 3
                          ? "text-orange-400"
                          : "text-gray-500"
                  }`}
                >
                  #{entry.rank}
                </span>
                <span className="text-sm text-gray-300 font-mono">{entry.address}</span>
              </div>
              <span className="text-sm font-semibold text-cyan-400">{entry.amount} SOL</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
