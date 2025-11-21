import type { HostawayReviewRaw, NormalizedReview } from "./types"

export function normalizeHostawayReview(raw: HostawayReviewRaw, approved = false): NormalizedReview {
  // Calculate overall rating from categories
  let rating = 0
  if (raw.reviewCategory && raw.reviewCategory.length > 0) {
    const sum = raw.reviewCategory.reduce((acc, cat) => acc + cat.rating, 0)
    rating = sum / raw.reviewCategory.length
  }

  // Build category map
  const categories: Record<string, number> = {}
  if (raw.reviewCategory) {
    raw.reviewCategory.forEach((cat) => {
      categories[cat.category] = cat.rating
    })
  }

  return {
    id: `hostaway-${raw.id}`,
    listingId: `listing-${raw.listingName.replace(/\s+/g, "-").toLowerCase()}`,
    listingName: raw.listingName,
    reviewType: raw.type,
    channel: "hostaway",
    guestName: raw.guestName,
    publicReview: raw.publicReview,
    categories,
    submittedAt: new Date(raw.submittedAt),
    rating,
    approved,
    featured: false,
  }
}

export function calculatePropertyPerformance(reviews: NormalizedReview[]) {
  const grouped = new Map<string, NormalizedReview[]>()

  reviews.forEach((review) => {
    if (!grouped.has(review.listingId)) {
      grouped.set(review.listingId, [])
    }
    grouped.get(review.listingId)!.push(review)
  })

  return Array.from(grouped.entries()).map(([listingId, propertyReviews]) => {
    const approvedReviews = propertyReviews.filter((r) => r.approved)
    const avgRating =
      approvedReviews.length > 0 ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length : 0

    const categoryAverages: Record<string, number> = {}
    const allCategories = new Set<string>()
    approvedReviews.forEach((r) => {
      Object.keys(r.categories).forEach((cat) => allCategories.add(cat))
    })

    allCategories.forEach((cat) => {
      const ratingsForCat = approvedReviews.filter((r) => cat in r.categories).map((r) => r.categories[cat])
      categoryAverages[cat] =
        ratingsForCat.length > 0 ? ratingsForCat.reduce((a, b) => a + b, 0) / ratingsForCat.length : 0
    })

    return {
      listingId,
      listingName: propertyReviews[0].listingName,
      totalReviews: propertyReviews.length,
      averageRating: avgRating,
      categoryAverages,
      recentReviews: propertyReviews.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()).slice(0, 5),
    }
  })
}
