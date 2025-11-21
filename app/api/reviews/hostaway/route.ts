import { NextResponse } from "next/server";
import axios from "axios";
import {
	normalizeHostawayReview,
	calculatePropertyPerformance,
} from "@/lib/review-normalizer";
import { mockReviews } from "@/lib/mock-reviews";

const approvedReviewIds = new Set<string>();

async function getAccessToken(): Promise<string | null> {
	const accountId = process.env.HOSTAWAY_ACCOUNT_ID || "61148";
	const apiKey =
		process.env.HOSTAWAY_API_KEY ||
		"f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152";

	try {
		const response = await axios.post(
			"https://api.hostaway.com/v1/accessTokens",
			`grant_type=client_credentials&client_id=${accountId}&client_secret=${apiKey}&scope=general`,
			{
				headers: {
					"Cache-control": "no-cache",
					"Content-type": "application/x-www-form-urlencoded",
				},
			}
		);

		const accessToken = response.data.access_token;
		if (!accessToken) {
			console.error("No access_token in response:", response.data);
			return null;
		}

		console.log("Successfully obtained access token");
		return accessToken;
	} catch (error: any) {
		console.error(
			"Error getting access token:",
			error.response?.data || error.message
		);
		return null;
	}
}

export async function GET(request: Request) {
	try {
		const accessToken = await getAccessToken();
		let reviews: any[] = [];
		let usesMockData = false;

		if (accessToken) {
			try {
				const response = await axios.get("https://api.hostaway.com/v1/reviews", {
					params: {
						accountId: process.env.HOSTAWAY_ACCOUNT_ID || "61148",
					},
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					timeout: 5000,
				});

				if (response.data.status === "success") {
					reviews = Array.isArray(response.data.result) ? response.data.result : [];
					console.log(`Fetched ${reviews.length} reviews from Hostaway API`);
				} else {
					console.warn("Hostaway API returned non-success status, using mock data");
					reviews = mockReviews;
					usesMockData = true;
				}
			} catch (apiError: any) {
				console.warn(
					"Failed to fetch from Hostaway API, falling back to mock data:",
					apiError.message
				);
				reviews = mockReviews;
				usesMockData = true;
			}
		} else {
			console.warn("Could not obtain access token, using mock data");
			reviews = mockReviews;
			usesMockData = true;
		}

		// Normalize reviews with approval status
		const normalizedReviews = reviews.map((raw: any) =>
			normalizeHostawayReview(raw, approvedReviewIds.has(`hostaway-${raw.id}`))
		);

		// Calculate performance metrics
		const performance = calculatePropertyPerformance(normalizedReviews);

		return NextResponse.json({
			status: "success",
			data: {
				reviews: normalizedReviews,
				performance,
				totalReviews: normalizedReviews.length,
				approvedReviews: normalizedReviews.filter((r) => r.approved).length,
				usingMockData: usesMockData,
			},
		});
	} catch (error: any) {
		console.error("Error in GET handler:", error.message);
		return NextResponse.json(
			{
				status: "error",
				message: "Failed to fetch reviews",
				data: { reviews: [], performance: [] },
			},
			{ status: 200 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const { reviewId, approved } = await request.json();

		if (!reviewId) {
			return NextResponse.json(
				{ status: "error", message: "Review ID is required" },
				{ status: 400 }
			);
		}

		// Update approval status in memory
		if (approved) {
			approvedReviewIds.add(reviewId);
		} else {
			approvedReviewIds.delete(reviewId);
		}

		console.log(`Review ${reviewId} ${approved ? "approved" : "rejected"}`);

		return NextResponse.json({
			status: "success",
			message: `Review ${approved ? "approved" : "rejected"} successfully`,
			data: { reviewId, approved },
		});
	} catch (error) {
		console.error("Error updating review:", error);
		return NextResponse.json(
			{ status: "error", message: "Failed to update review" },
			{ status: 500 }
		);
	}
}
