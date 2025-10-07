"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function GoalBar() {
  // Placeholder goal data
  const current = 45.8
  const goal = 100
  const percentage = (current / goal) * 100

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-green-400" />
          <CardTitle className="text-white">Stream Goal</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Progress</span>
          <span className="text-white font-semibold">
            {current} / {goal} SOL
          </span>
        </div>
        <Progress value={percentage} className="h-2 bg-white/10" />
        <p className="text-xs text-gray-500 text-center">{percentage.toFixed(1)}% complete</p>
      </CardContent>
    </Card>
  )
}
