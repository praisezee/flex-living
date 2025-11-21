# Google Reviews Integration Research & Findings

## Overview
This document outlines the findings and recommendations for integrating Google Reviews into the Flex Living Reviews Dashboard.

## Integration Options

### 1. Google Places API
- **Status**: Requires authentication and API key setup
- **Cost**: $7 per 1000 requests (with free tier: 28,500 API calls/month)
- **Implementation**: REST API with OAuth 2.0
- **Data Available**: Reviews, ratings, place details, photos
- **Authentication**: API Key or OAuth 2.0

**Pros**:
- Most comprehensive data
- Direct access to Google ratings and reviews
- Real-time updates
- Supports multiple locations

**Cons**:
- Requires Google Cloud Project setup
- Cost after free tier
- Rate limits (25,000 requests/day by default)
- Requires business verification

### 2. Google My Business (GMB) API
- **Status**: Deprecated by Google - being replaced with Business Profile API
- **Note**: Use Business Profile API instead (v1)

**Pros**:
- Direct access to business profile data
- Integrated with Google's business ecosystem

**Cons**:
- Requires business authentication
- Deprecated endpoint
- Migrating to new API structure

### 3. Business Profile API (Recommended)
- **Status**: Current recommended solution
- **Cost**: Free
- **Implementation**: REST API with OAuth 2.0
- **Data Available**: Business profile, reviews, locations

**Pros**:
- Official current API
- Free tier available
- OAuth 2.0 support
- Direct integration with Google Search & Maps

**Cons**:
- Requires OAuth 2.0 setup
- Verified business account needed
- Less data compared to Places API

## Recommended Implementation

### Approach: Hybrid Integration

1. **Primary**: Use Google Places API for reading reviews
2. **Secondary**: Use Business Profile API for profile management
3. **Fallback**: Use scraped data or RSS feeds if API limits reached

### Implementation Steps

\`\`\`typescript
// Example structure for Google Reviews API integration
interface GoogleReviewsAPI {
  placeId: string
  apiKey: string
  
  // Fetch reviews for a specific place
  fetchReviews(placeId: string): Promise<GoogleReview[]>
  
  // Get place details with ratings
  getPlaceDetails(placeId: string): Promise<PlaceDetails>
  
  // Search places by query
  searchPlaces(query: string): Promise<Place[]>
}

interface GoogleReview {
  authorName: string
  authorUrl?: string
  language: string
  profilePhotoUrl?: string
  rating: number
  relativeTimeDescription: string
  text: string
  time: number
  publishedAt: Date
}
\`\`\`

### API Setup Instructions

1. **Create Google Cloud Project**
   - Go to https://console.cloud.google.com
   - Create new project
   - Enable Places API and Business Profile API

2. **Configure OAuth 2.0**
   - Create OAuth 2.0 credentials
   - Set authorized redirect URIs
   - Download credentials JSON

3. **Environment Variables**
   \`\`\`
   GOOGLE_PLACES_API_KEY=your_api_key
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_BUSINESS_ID=your_business_profile_id
   \`\`\`

4. **Add Routes**
   \`\`\`
   GET /api/reviews/google - Fetch Google reviews
   GET /api/auth/google - OAuth callback
   \`\`\`

## Cost Analysis

- **Places API**: ~$2.10 per 1000 reviews
- **Business Profile API**: Free
- **Combined estimated monthly cost**: $5-20 (depending on review volume)

## Alternative: Web Scraping

For budget-conscious implementations without API:
- Use Puppeteer or Cheerio for scraping Google Business profiles
- Limitation: May violate Google ToS
- Not recommended for production

## Implementation Timeline

- **Phase 1** (Week 1): Set up Google Cloud Project & OAuth
- **Phase 2** (Week 2): Implement Places API integration
- **Phase 3** (Week 3): Add to dashboard with filtering
- **Phase 4** (Week 4): Testing & optimization

## Conclusion

**Recommendation**: Implement Google Places API for comprehensive review data while using Business Profile API for lightweight operations. This hybrid approach provides the best balance of features and cost for most property management scenarios.

The implementation should:
1. Mirror the existing Hostaway normalization pattern
2. Support the same NormalizedReview interface
3. Allow filtering and sorting by Google channel
4. Display approval status separately for each platform

## Future Enhancements

- Sync approval status to Google Business Profile
- Auto-respond to reviews via Google Business API
- Multi-location management
- Historical review analytics
- Review sentiment analysis
