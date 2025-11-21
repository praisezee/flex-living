"use client"

import { Star, TrendingUp } from "lucide-react"
import type { PropertyPerformance } from "@/lib/types"

interface PropertyStatsProps {
  performance: PropertyPerformance[]
}

export function PropertyStats({ performance }: PropertyStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {performance.map((prop) => (
        <div key={prop.listingId} className="rounded-lg border bg-card p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Property</p>
              <p className="font-semibold text-sm line-clamp-2">{prop.listingName}</p>
            </div>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>

          <div className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Average Rating</p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">{prop.averageRating.toFixed(1)}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < Math.round(prop.averageRating) ? "fill-primary text-primary" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Total Reviews</p>
              <p className="font-semibold">{prop.totalReviews}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
