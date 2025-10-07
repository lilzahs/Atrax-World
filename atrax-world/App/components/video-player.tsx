"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Maximize2, Minimize2 } from "lucide-react"

export function VideoPlayer() {
  const searchParams = useSearchParams()
  const videoId = searchParams.get("video") || "dQw4w9WgXcQ"
  const [isTheater, setIsTheater] = useState(false)

  return (
    <Card className="bg-black border-white/10 overflow-hidden">
      <div className="relative">
        <div className={`relative ${isTheater ? "aspect-[21/9]" : "aspect-video"} bg-black`}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Stream Video"
          />
        </div>
        <div className="absolute top-4 right-4">
          <Button
            size="sm"
            variant="secondary"
            className="bg-black/60 hover:bg-black/80 backdrop-blur border-white/10"
            onClick={() => setIsTheater(!isTheater)}
          >
            {isTheater ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Card>
  )
}
