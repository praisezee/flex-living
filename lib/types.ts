// API Response Types
export interface HostawayReviewRaw {
  id: number
  type: "host-to-guest" | "guest-to-host"
  status: "published" | "draft"
  rating: number | null
  publicReview: string
  reviewCategory: Array<{
    category: string
    rating: number
  }>
  submittedAt: string
  guestName: string
  listingName: string
}

// Normalized Review Type
export interface NormalizedReview {
  id: string
  listingId: string
  listingName: string
  reviewType: "host-to-guest" | "guest-to-host"
  channel: "hostaway" | "google"
  guestName: string
  publicReview: string
  categories: Record<string, number>
  submittedAt: Date
  rating: number
  approved: boolean
  featured: boolean
}

export interface PropertyPerformance {
  listingId: string
  listingName: string
  totalReviews: number
  averageRating: number
  categoryAverages: Record<string, number>
  recentReviews: NormalizedReview[]
}

export interface FilterOptions {
  listingId?: string
  channel?: "hostaway" | "google"
  reviewType?: "host-to-guest" | "guest-to-host"
  minRating?: number
  maxRating?: number
  category?: string
  dateFrom?: Date
  dateTo?: Date
  approved?: boolean
}
