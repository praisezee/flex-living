"use client";

import Link from "next/link";
import {
	ChevronRight,
	Building2,
	TrendingUp,
	CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
	return (
		<div className="min-h-screen bg-linear-to-br from-background to-muted">
			<header className="border-b bg-card/80 backdrop-blur sticky top-0 z-10">
				<div className="max-w-6xl mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="rounded-lg bg-linear-to-br from-primary to-primary/80 p-2.5">
								<Building2 className="h-6 w-6 text-primary-foreground" />
							</div>
							<div>
								<span className="font-bold text-lg">Flex Living</span>
								<p className="text-xs text-muted-foreground">
									Guest Reviews Management
								</p>
							</div>
						</div>
						<Link href="/dashboard">
							<Button>Open Dashboard</Button>
						</Link>
					</div>
				</div>
			</header>

			<main className="max-w-6xl mx-auto px-6 py-16">
				<div className="text-center mb-12">
					<h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
						Guest Reviews Management System
					</h1>
					<p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
						Manage, analyze, and showcase guest reviews across all your properties
						with our comprehensive dashboard.
					</p>
					<Link href="/dashboard">
						<Button
							size="lg"
							className="gap-2">
							Open Dashboard <ChevronRight className="h-5 w-5" />
						</Button>
					</Link>
				</div>

				{/* Feature Grid */}
				<div className="grid gap-6 md:grid-cols-3 mb-16">
					{[
						{
							title: "Property Performance",
							description:
								"View ratings and reviews across all your properties at a glance",
							icon: TrendingUp,
						},
						{
							title: "Smart Filtering",
							description: "Filter reviews by rating, category, channel, and type",
							icon: Building2,
						},
						{
							title: "Review Approval",
							description: "Select which reviews display on your public website",
							icon: CheckCircle2,
						},
					].map((feature, i) => (
						<div
							key={i}
							className="rounded-lg border bg-card p-6 hover:border-primary transition-colors">
							<div className="mb-3">
								<feature.icon className="h-8 w-8 text-primary" />
							</div>
							<h3 className="font-bold mb-2">{feature.title}</h3>
							<p className="text-sm text-muted-foreground">{feature.description}</p>
						</div>
					))}
				</div>

				{/* Properties Section */}
				<div className="mb-16">
					<h2 className="text-2xl font-bold mb-6">Featured Properties</h2>
					<div className="grid gap-4 md:grid-cols-3">
						{[
							{
								name: "2B N1 A - 29 Shoreditch Heights",
								slug: "2b-n1-a-29-shoreditch-heights",
								image: "/modern-london-apartment-shoreditch.jpg",
							},
							{
								name: "1B Luxury Suite - Chelsea District",
								slug: "1b-luxury-suite-chelsea-district",
								image: "/luxury-apartment-chelsea-london.jpg",
							},
							{
								name: "3B Penthouse - Downtown",
								slug: "3b-penthouse-downtown",
								image: "/modern-penthouse-city-downtown.jpg",
							},
						].map((property) => (
							<Link
								key={property.slug}
								href={`/property/${property.slug}`}>
								<div className="rounded-lg border overflow-hidden bg-card hover:border-primary transition-colors cursor-pointer group">
									<img
										src={property.image || "/placeholder.svg"}
										alt={property.name}
										className="w-full h-48 object-cover group-hover:brightness-95 transition"
									/>
									<div className="p-4">
										<h3 className="font-bold mb-2">{property.name}</h3>
										<span className="text-sm text-primary">
											View Reviews <ChevronRight className="h-4 w-4 inline" />
										</span>
									</div>
								</div>
							</Link>
						))}
					</div>
				</div>

				{/* API Documentation */}
				<div className="rounded-lg border bg-card p-8 max-w-2xl mx-auto">
					<h3 className="text-lg font-bold mb-4">API Integration</h3>
					<p className="text-sm text-muted-foreground mb-4">
						The reviews dashboard integrates with the Hostaway Reviews API. All
						reviews are normalized and cached for optimal performance.
					</p>
					<div className="space-y-2 text-sm font-mono bg-muted p-4 rounded">
						<p>
							<span className="text-primary">GET</span> /api/reviews/hostaway - Fetch
							all reviews
						</p>
						<p>
							<span className="text-primary">POST</span> /api/reviews/hostaway - Update
							review approval status
						</p>
					</div>
				</div>
			</main>
		</div>
	);
}
