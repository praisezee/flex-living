"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { FilterOptions } from "@/lib/types"

interface ReviewFiltersProps {
  properties: string[]
  onFilterChange: (filters: FilterOptions) => void
}

export function ReviewFilters({ properties, onFilterChange }: ReviewFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({})

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const ratingOptions = [
    { label: "All Ratings", value: undefined },
    { label: "9-10", value: 9 },
    { label: "7-8", value: 7 },
    { label: "Below 7", value: 0 },
  ]

  const channels = ["hostaway", "google"] as const

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="grid gap-4 md:grid-cols-4">
        {/* Property Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium">Property</label>
          <select
            value={filters.listingId || ""}
            onChange={(e) => handleFilterChange({ ...filters, listingId: e.target.value || undefined })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All Properties</option>
            {properties.map((prop) => (
              <option key={prop} value={prop}>
                {prop.replace("listing-", "").replace(/-/g, " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium">Rating</label>
          <select
            value={filters.minRating || ""}
            onChange={(e) => {
              const val = e.target.value
              if (val === "9") handleFilterChange({ ...filters, minRating: 9 })
              else if (val === "7") handleFilterChange({ ...filters, minRating: 7, maxRating: 8.9 })
              else if (val === "0") handleFilterChange({ ...filters, maxRating: 7 })
              else handleFilterChange({ ...filters, minRating: undefined, maxRating: undefined })
            }}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {ratingOptions.map((opt) => (
              <option key={opt.label} value={opt.value === undefined ? "" : opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Channel Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium">Channel</label>
          <select
            value={filters.channel || ""}
            onChange={(e) => handleFilterChange({ ...filters, channel: (e.target.value as any) || undefined })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All Channels</option>
            {channels.map((ch) => (
              <option key={ch} value={ch}>
                {ch.charAt(0).toUpperCase() + ch.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Review Type Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium">Type</label>
          <select
            value={filters.reviewType || ""}
            onChange={(e) => handleFilterChange({ ...filters, reviewType: (e.target.value as any) || undefined })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All Types</option>
            <option value="guest-to-host">Guest to Host</option>
            <option value="host-to-guest">Host to Guest</option>
          </select>
        </div>
      </div>

      {Object.keys(filters).length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFilters({})
            onFilterChange({})
          }}
          className="w-full"
        >
          Clear Filters
        </Button>
      )}
    </div>
  )
}
