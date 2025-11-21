"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import { Star, Users, Wifi, Coffee, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { NormalizedReview } from "@/lib/types"

export default function PropertyPage({ params }: { params: { slug: string } }) {
  const [reviews, setReviews] = useState<NormalizedReview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("/api/reviews/hostaway")
        const data = res.data
        const approvedReviews = data.data.reviews.filter((r: NormalizedReview) => r.approved)
        // Filter by property
        setReviews(
          approvedReviews.filter(
            (r: NormalizedReview) =>
              r.listingName.toLowerCase().includes(params.slug) || r.listingId.includes(params.slug),
          ),
        )
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [params.slug])

  const propertyData = {
    "2b-n1-a-29-shoreditch-heights": {
      name: "2B N1 A - 29 Shoreditch Heights",
      image: "/modern-london-apartment-shoreditch-2-bedrooms.jpg",
      price: "$150/night",
      beds: 2,
      baths: 1,
      guests: 4,
      features: ["WiFi", "Kitchen", "Washing Machine", "Air Conditioning"],
      description:
        "Beautiful 2-bedroom apartment in the heart of Shoreditch. Perfect for families or groups visiting London.",
    },
    "1b-luxury-suite-chelsea-district": {
      name: "1B Luxury Suite - Chelsea District",
      image: "/luxury-1-bedroom-apartment-chelsea-london.jpg",
      price: "$200/night",
      beds: 1,
      baths: 1,
      guests: 2,
      features: ["WiFi", "Kitchen", "Hot Tub", "Smart TV", "Premium Bedding"],
      description: "Luxurious 1-bedroom suite in Chelsea. Modern design with high-end amenities.",
    },
    "3b-penthouse-downtown": {
      name: "3B Penthouse - Downtown",
      image: "/modern-3-bedroom-penthouse-downtown-city-view.jpg",
      price: "$300/night",
      beds: 3,
      baths: 2,
      guests: 6,
      features: ["WiFi", "Kitchen", "Rooftop Access", "Smart Home", "Concierge Service"],
      description: "Stunning penthouse with panoramic city views. Premium amenities and dedicated concierge.",
    },
  }

  const property =
    propertyData[params.slug as keyof typeof propertyData] || propertyData["2b-n1-a-29-shoreditch-heights"]
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="border-b bg-card sticky top-0 z-20">
        <div className="px-6 py-4 max-w-6xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Property Hero */}
        <div className="mb-8">
          <img
            src={property.image || "/placeholder.svg"}
            alt={property.name}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Property Details */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
          <p className="text-muted-foreground mb-4">{property.description}</p>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-lg font-semibold mb-4">{property.price}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{property.guests} guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>
                    {property.beds} bedroom{property.beds > 1 ? "s" : ""} • {property.baths} bathroom
                    {property.baths > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Amenities</p>
              <div className="grid gap-2 text-sm">
                {property.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    {feature === "WiFi" && <Wifi className="h-4 w-4" />}
                    {feature === "Kitchen" && <Coffee className="h-4 w-4" />}
                    {!["WiFi", "Kitchen"].includes(feature) && <div className="h-4 w-4" />}
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t pt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Guest Reviews</h2>
            {reviews.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{avgRating.toFixed(1)}</span>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.round(avgRating) ? "fill-primary text-primary" : "text-muted-foreground"}`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-muted-foreground">Based on {reviews.length} reviews</span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="rounded-lg border bg-card p-8 text-center">
              <p className="text-muted-foreground">No reviews available for this property yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-lg border bg-card p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{review.guestName}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < Math.round(review.rating) ? "fill-primary text-primary" : "text-muted-foreground"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                      {review.reviewType === "guest-to-host" ? "Guest Review" : "Host Review"}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{review.publicReview}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
