# Flex Living Reviews Dashboard - Technical Documentation

## Overview
A comprehensive guest reviews management system for Flex Living properties, enabling managers to view, filter, and approve reviews for public display.

## Tech Stack
- **Frontend**: Next.js 16 with React 19, TypeScript
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Components**: shadcn/ui
- **Backend**: Next.js API Routes
- **Data**: Mock Hostaway API responses (sandboxed)

## Project Structure

### Key Files
- `/app/api/reviews/hostaway/route.ts` - Review normalization & API endpoint
- `/lib/types.ts` - TypeScript interfaces for reviews and performance data
- `/lib/review-normalizer.ts` - Review normalization logic
- `/lib/mock-reviews.ts` - Mock review data
- `/app/dashboard/page.tsx` - Manager dashboard
- `/app/property/[slug]/page.tsx` - Property details with reviews
- `/app/page.tsx` - Landing page

## Key Design Decisions

### 1. Review Normalization
Reviews from Hostaway are normalized into a standardized format:
\`\`\`typescript
interface NormalizedReview {
  id: string
  listingId: string
  listingName: string
  reviewType: 'host-to-guest' | 'guest-to-host'
  channel: 'hostaway' | 'google'
  guestName: string
  publicReview: string
  categories: Record<string, number>
  submittedAt: Date
  rating: number
  approved: boolean
}
\`\`\`

### 2. Approval Workflow
- Reviews are loaded with `approved` status
- Managers can toggle approval from the dashboard
- Only approved reviews display on property detail pages
- Approval state is tracked in-memory (in production, would use database)

### 3. Performance Metrics
Property performance is calculated based on approved reviews:
- Average rating across all categories
- Per-category averages
- Recent review history
- Total review count

### 4. Filtering Strategy
Filters are applied client-side for responsive UX:
- Property selection
- Rating ranges (9-10, 7-8, Below 7)
- Channel (Hostaway, Google)
- Review type (Guest-to-Host, Host-to-Guest)
- Date range support (prepared)

## API Routes

### GET /api/reviews/hostaway
Returns all reviews with performance metrics
\`\`\`json
{
  "status": "success",
  "data": {
    "reviews": [...],
    "performance": [...],
    "totalReviews": 9,
    "approvedReviews": 5
  }
}
\`\`\`

### POST /api/reviews/hostaway
Updates review approval status
\`\`\`json
{
  "reviewId": "hostaway-7453",
  "approved": true,
  "featured": false
}
\`\`\`

## Features

### Dashboard
- View all properties with performance metrics (avg rating, total reviews)
- Filter reviews by property, rating, channel, type
- Real-time approval/rejection of reviews
- Category-based rating breakdowns
- Sort options (most recent, highest/lowest rating)

### Property Pages
- Displays only approved reviews
- Shows overall property rating
- Categories breakdown visible
- Guest review details (name, date, rating, comment)

## Google Reviews Integration - Findings

### Status: Research Complete
Google Reviews integration was evaluated with the following findings:

#### Options Considered:
1. **Google Places API** - Requires business verification
2. **Google My Business API** - Requires OAuth setup
3. **Third-party aggregators** - Adds dependency management

#### Recommendation:
For a production system, use Google Places API with:
- API key configuration
- OAuth flow for manager authentication
- Rate limiting (50k requests/day free tier)
- Caching strategy to minimize API calls

#### Implementation Path (if needed):
\`\`\`typescript
// Would require:
// 1. GOOGLE_PLACES_API_KEY environment variable
// 2. New endpoint: /api/reviews/google
// 3. Review normalization from Google format
// 4. Merge with Hostaway reviews in frontend
\`\`\`

Currently not implemented as per sandboxed environment constraints.

## Data Flow

### Review Load
1. Dashboard loads → fetches `/api/reviews/hostaway`
2. API normalizes mock reviews
3. Reviews grouped by property
4. Performance metrics calculated
5. Frontend renders with approval status

### Approval Update
1. Manager clicks Approve/Reject
2. POST to `/api/reviews/hostaway`
3. In-memory approval set updated
4. Frontend re-fetches for sync
5. Property pages reflect changes

## Future Enhancements

1. **Database Integration**
   - Persist approval status
   - Track approval history
   - Store Google reviews

2. **Real API Integration**
   - Connect to actual Hostaway API
   - Implement OAuth for API access
   - Add rate limiting

3. **Advanced Features**
   - Review sentiment analysis
   - Automated insights & alerts
   - Review response workflow
   - Multi-language support

4. **Performance Optimization**
   - Implement pagination
   - Add caching layer
   - Review archive system

## Running Locally

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open http://localhost:3000
4. Navigate to /dashboard for manager view
5. Navigate to /property/[slug] for public view

## Testing

### Manual Test Scenarios
1. **Load Dashboard**: Verify all 9 mock reviews load with correct properties
2. **Filter by Rating**: Approve 2-star review, filter 9-10 range, verify not shown
3. **Property View**: Approve review in dashboard, verify appears on property page
4. **Category Details**: Check that all category ratings display correctly

## Notes
- Mock reviews use realistic Hostaway API response format
- Review timestamps span Jan-Mar 2024
- Properties have 2-4 reviews each
- 5 of 9 reviews pre-approved for demo purposes
