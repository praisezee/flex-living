"use client";

import { useState } from "react";
import { Check, X, Star } from "lucide-react";
import axios from "axios";
import type { NormalizedReview } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ReviewCardProps {
	review: NormalizedReview;
	onApprovalChange: (reviewId: string, approved: boolean) => void;
}

export function ReviewCard({ review, onApprovalChange }: ReviewCardProps) {
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const handleApproval = async (approved: boolean) => {
		setIsLoading(true);
		try {
			const response = await axios.post("/api/reviews/hostaway", {
				reviewId: review.id,
				approved,
			});

			const data = response.data;

			if (data.status === "success") {
				onApprovalChange(review.id, approved);
				toast({
					title: "Success",
					description: data.message,
				});
			} else {
				toast({
					title: "Error",
					description: data.message || "Failed to update review",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error updating review:", error);
			toast({
				title: "Error",
				description: "Failed to update review. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const categoryNames: Record<string, string> = {
		cleanliness: "Cleanliness",
		communication: "Communication",
		accuracy: "Accuracy",
		location: "Location",
		respect_house_rules: "House Rules",
	};

	return (
		<div
			className={`rounded-lg border p-4 ${
				review.approved ? "bg-accent/5" : "bg-destructive/5"
			}`}>
			<div className="mb-3 flex items-start justify-between">
				<div>
					<div className="flex items-center gap-2">
						<h3 className="font-semibold">{review.guestName}</h3>
						<div className="flex items-center gap-1">
							{Array.from({ length: 5 }).map((_, i) => (
								<Star
									key={i}
									className={`h-3 w-3 ${
										i < Math.round(review.rating)
											? "fill-primary text-primary"
											: "text-muted-foreground"
									}`}
								/>
							))}
						</div>
					</div>
					<p className="text-xs text-muted-foreground">
						{new Date(review.submittedAt).toLocaleDateString()}
					</p>
				</div>
				<span
					className={`rounded-full px-2 py-1 text-xs font-medium ${
						review.approved
							? "bg-primary/20 text-primary"
							: "bg-destructive/20 text-destructive"
					}`}>
					{review.approved ? "Approved" : "Pending"}
				</span>
			</div>

			<p className="mb-3 text-sm text-foreground">{review.publicReview}</p>

			<div className="mb-3 grid gap-2">
				{Object.entries(review.categories).map(([category, rating]) => (
					<div
						key={category}
						className="flex items-center justify-between">
						<span className="text-xs text-muted-foreground">
							{categoryNames[category] || category}
						</span>
						<span className="text-xs font-semibold">{rating}/10</span>
					</div>
				))}
			</div>

			<div className="flex gap-2">
				<Button
					size="sm"
					variant={review.approved ? "outline" : "default"}
					onClick={() => handleApproval(!review.approved)}
					disabled={isLoading}
					className="flex-1">
					{review.approved ? (
						<>
							<X className="h-4 w-4 mr-1" /> Reject
						</>
					) : (
						<>
							<Check className="h-4 w-4 mr-1" /> Approve
						</>
					)}
				</Button>
			</div>
		</div>
	);
}
