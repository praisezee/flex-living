"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardHeader } from "@/components/dashboard-header";
import { ReviewFilters } from "@/components/review-filters";
import { ReviewCard } from "@/components/review-card";
import { PropertyStats } from "@/components/property-stats";
import type {
	NormalizedReview,
	PropertyPerformance,
	FilterOptions,
} from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
	const [reviews, setReviews] = useState<NormalizedReview[]>([]);
	const [performance, setPerformance] = useState<PropertyPerformance[]>([]);
	const [filteredReviews, setFilteredReviews] = useState<NormalizedReview[]>([]);
	const [filters, setFilters] = useState<FilterOptions>({});
	const [loading, setLoading] = useState(true);
	const [sortBy, setSortBy] = useState("recent");
	const [usingMockData, setUsingMockData] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		const fetchReviews = async () => {
			try {
				const res = await axios.get("/api/reviews/hostaway");
				const data = res.data;
				setReviews(data.data.reviews);
				setPerformance(data.data.performance);
				setUsingMockData(data.data.usingMockData || false);

				if (data.data.usingMockData) {
					toast({
						title: "Note",
						description: "Using mock data. Hostaway API is currently unavailable.",
						variant: "default",
					});
				}
			} catch (error) {
				console.error("Error fetching reviews:", error);
				toast({
					title: "Error",
					description: "Failed to load reviews",
					variant: "destructive",
				});
			} finally {
				setLoading(false);
			}
		};
		fetchReviews();
	}, [toast]);

	useEffect(() => {
		let filtered = [...reviews];

		if (filters.listingId) {
			filtered = filtered.filter((r) => r.listingId === filters.listingId);
		}
		if (filters.minRating !== undefined) {
			filtered = filtered.filter((r) => r.rating >= filters.minRating!);
		}
		if (filters.maxRating !== undefined) {
			filtered = filtered.filter((r) => r.rating <= filters.maxRating!);
		}
		if (filters.channel) {
			filtered = filtered.filter((r) => r.channel === filters.channel);
		}
		if (filters.reviewType) {
			filtered = filtered.filter((r) => r.reviewType === filters.reviewType);
		}
		if (filters.approved !== undefined) {
			filtered = filtered.filter((r) => r.approved === filters.approved);
		}

		if (sortBy === "recent") {
			filtered.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
		} else if (sortBy === "rating-high") {
			filtered.sort((a, b) => b.rating - a.rating);
		} else if (sortBy === "rating-low") {
			filtered.sort((a, b) => a.rating - b.rating);
		}

		setFilteredReviews(filtered);
	}, [reviews, filters, sortBy]);

	const handleApprovalChange = (reviewId: string, approved: boolean) => {
		setReviews(reviews.map((r) => (r.id === reviewId ? { ...r, approved } : r)));
	};

	const properties = Array.from(new Set(reviews.map((r) => r.listingId)));

	return (
		<div className="min-h-screen bg-background">
			<DashboardHeader />

			<main className="space-y-6 p-6 max-w-7xl mx-auto">
				{usingMockData && (
					<div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
						Currently displaying mock data. Hostaway API integration is in sandbox
						mode.
					</div>
				)}

				<PropertyStats performance={performance} />

				<ReviewFilters
					properties={properties}
					onFilterChange={setFilters}
				/>

				<div>
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-lg font-semibold">
							Reviews ({filteredReviews.length})
						</h2>
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className="rounded-md border border-input bg-background px-3 py-2 text-sm">
							<option value="recent">Most Recent</option>
							<option value="rating-high">Highest Rating</option>
							<option value="rating-low">Lowest Rating</option>
						</select>
					</div>

					{loading ? (
						<div className="text-center py-8">Loading reviews...</div>
					) : reviews.length === 0 ? (
						<div className="rounded-lg border bg-card p-8 text-center">
							<p className="text-muted-foreground">No reviews found.</p>
						</div>
					) : filteredReviews.length === 0 ? (
						<div className="rounded-lg border bg-card p-8 text-center">
							<p className="text-muted-foreground">
								No reviews found matching your filters
							</p>
						</div>
					) : (
						<div className="grid gap-4">
							{filteredReviews.map((review) => (
								<ReviewCard
									key={review.id}
									review={review}
									onApprovalChange={handleApprovalChange}
								/>
							))}
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
