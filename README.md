# Travel Companion App

A comprehensive travel tracking application built with Next.js, Supabase, and TypeScript that helps users track trips, manage companions, and earn rewards.

## Features

- **User Authentication**: Secure email/password authentication with Supabase
- **Trip Tracking**: Real-time GPS tracking with distance and speed calculations
- **Companion Management**: Invite and manage travel companions
- **Rewards System**: Earn badges based on travel milestones
- **Analytics Dashboard**: View comprehensive travel statistics
- **Data Persistence**: All data securely stored in Supabase PostgreSQL
- **Error Handling**: Comprehensive error handling and validation
- **Security**: Rate limiting, input validation, and Row Level Security

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Type Safety**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd travel-companion-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Update `.env.local` with your Supabase credentials:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

5. Run database migrations (if needed):
\`\`\`bash
npm run db:migrate
\`\`\`

6. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

Open http://localhost:3000 in your browser.

## Project Structure

\`\`\`
├── app/
│   ├── api/              # API routes for backend
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Main app pages
│   └── page.tsx          # Home page
├── components/
│   ├── ui/               # Shadcn UI components
│   └── error-boundary.tsx
├── hooks/
│   ├── useTrips.ts       # Trip management hook
│   ├── useStats.ts       # Statistics hook
│   ├── useRewards.ts     # Rewards hook
│   └── useGPSTracking.ts # GPS tracking hook
├── lib/
│   ├── supabase/         # Supabase clients
│   ├── database/         # Database operations
│   ├── validation.ts     # Zod schemas
│   ├── security.ts       # Security utilities
│   ├── error-handler.ts  # Error handling
│   └── api-client.ts     # API client utilities
├── scripts/
│   └── 001_create_database_schema.sql
└── public/
\`\`\`

## API Endpoints

### Trips
- `GET /api/trips` - Get all user trips
- `POST /api/trips` - Create a new trip
- `POST /api/trips/complete` - Complete a trip
- `POST /api/tracking/update` - Update trip tracking data

### User
- `GET /api/user/stats` - Get user statistics
- `GET /api/user/profile` - Get user profile

### Rewards
- `GET /api/rewards` - Get user rewards
- `GET /api/rewards/check-achievements` - Check for new achievements

## Database Schema

### Main Tables

**profiles**
- Stores user profile information
- Links to auth.users via UUID

**trips**
- Tracks individual trips
- Includes origin, destination, transport mode, distance
- Status: active, completed, cancelled

**trip_companions**
- Many-to-many relationship for trip companions
- Tracks invitation status

**user_rewards**
- Stores earned badges and points
- Automatic badging system

**user_preferences**
- Stores user travel preferences for recommendations

## Authentication Flow

1. User signs up with email, password, and profile info
2. Email verification sent (optional)
3. User logs in with credentials
4. JWT token stored in secure cookie
5. Middleware refreshes token on each request
6. Logout clears session

## Error Handling

The application uses a centralized error handling system:

- **AppError**: Custom error class with error codes
- **Error Boundaries**: React error boundaries for UI failures
- **API Error Responses**: Standardized JSON error responses
- **Validation**: Zod schema validation on all inputs

## Security

- **Authentication**: Supabase handles authentication securely
- **Authorization**: Row Level Security (RLS) on all tables
- **Rate Limiting**: Built-in rate limiting on API routes
- **Input Validation**: All inputs validated with Zod
- **CORS**: Configured for Supabase URLs
- **Environment Variables**: Sensitive data in env variables

## Usage Examples

### Start Tracking a Trip

\`\`\`typescript
import { useGPSTracking } from "@/hooks/useGPSTracking"

function TrackingComponent() {
  const { isTracking, stats, startTracking, stopTracking } = useGPSTracking()

  return (
    <div>
      <button onClick={startTracking}>Start Tracking</button>
      <button onClick={stopTracking}>Stop Tracking</button>
      <p>Distance: {stats.distance} km</p>
      <p>Speed: {stats.averageSpeed} km/h</p>
    </div>
  )
}
\`\`\`

### Fetch User Statistics

\`\`\`typescript
import { useStats } from "@/hooks/useStats"

function StatsComponent() {
  const { stats, loading, error } = useStats()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <p>Total Distance: {stats?.total_distance} km</p>
      <p>Total Trips: {stats?.total_trips}</p>
      <p>Carbon Saved: {stats?.carbon_saved} kg CO2</p>
    </div>
  )
}
\`\`\`

## Testing

### Running Tests

\`\`\`bash
npm run test
\`\`\`

### Writing Tests

Tests are located in `__tests__` directories next to their source files.

Example test:
\`\`\`typescript
import { validateRequest, tripSchema } from "@/lib/validation"

describe("Trip Validation", () => {
  it("should validate valid trip data", () => {
    const validTrip = {
      trip_number: "TRIP-001",
      origin: "New York",
      destination: "Boston",
      transport_mode: "car",
      start_time: new Date().toISOString(),
    }

    const result = validateRequest(tripSchema, validTrip)
    expect(result.success).toBe(true)
  })
})
\`\`\`

## Performance Optimization

- **Caching**: SWR for client-side data fetching
- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Next.js Image component for images
- **Database Indexes**: Indexes on frequently queried columns
- **Rate Limiting**: Prevents abuse

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

\`\`\`bash
npm run build
npm run start
\`\`\`

## Troubleshooting

### GPS Not Working
- Check browser permissions for location
- Ensure HTTPS (required for Geolocation API)
- Verify GPS accuracy setting in hook

### Database Connection Error
- Check Supabase URL and keys
- Verify database is running
- Check network connectivity

### Authentication Issues
- Clear cookies and cache
- Re-authenticate
- Check Supabase auth settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open a GitHub issue or contact support.
