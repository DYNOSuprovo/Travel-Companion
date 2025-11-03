# API Documentation

## Authentication

All API endpoints (except auth endpoints) require authentication via bearer token.

### Headers
\`\`\`
Authorization: Bearer <jwt_token>
\`\`\`

## Trip Endpoints

### GET /api/trips
Retrieve all trips for authenticated user.

**Query Parameters:**
- `status` (optional): Filter by status (active, completed, cancelled)
- `limit` (optional): Max 100, default 10

**Response:**
\`\`\`json
{
  "trips": [
    {
      "id": "uuid",
      "trip_number": "TRIP-001",
      "origin": "New York",
      "destination": "Boston",
      "transport_mode": "car",
      "distance_km": 215.5,
      "status": "completed",
      "start_time": "2024-01-15T10:00:00Z",
      "end_time": "2024-01-15T14:30:00Z"
    }
  ],
  "count": 1
}
\`\`\`

### POST /api/trips
Create a new trip.

**Request Body:**
\`\`\`json
{
  "trip_number": "TRIP-001",
  "origin": "New York",
  "destination": "Boston",
  "transport_mode": "car",
  "start_time": "2024-01-15T10:00:00Z",
  "distance_km": 0
}
\`\`\`

**Response:** Returns created trip object with status 201.

### POST /api/trips/complete
Complete an active trip.

**Request Body:**
\`\`\`json
{
  "trip_id": "uuid",
  "distance_km": 215.5
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true
}
\`\`\`

## User Endpoints

### GET /api/user/stats
Get user statistics.

**Response:**
\`\`\`json
{
  "total_distance": 1247.5,
  "total_trips": 89,
  "average_distance": 14.02,
  "average_speed": 42.3,
  "carbon_saved": 156.8,
  "mode_breakdown": {
    "car": 45,
    "bus": 30,
    "cycling": 14
  },
  "active_trips": 2
}
\`\`\`

## Rewards Endpoints

### GET /api/rewards/check-achievements
Check for newly earned achievements.

**Response:**
\`\`\`json
{
  "achievements": [
    {
      "type": "distance",
      "name": "Thousand Miler",
      "description": "Travelled over 1000 km",
      "points": 500
    }
  ]
}
\`\`\`

## Error Responses

### Error Format
\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {
      "errors": ["field: error message"]
    },
    "timestamp": "2024-01-15T10:00:00Z"
  }
}
\`\`\`

### Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Rate Limited
- `500`: Internal Server Error

## Rate Limiting

API endpoints have rate limits:
- GET trips: 30 requests/minute
- POST trips: 10 requests/minute
- GET stats: 20 requests/minute
- Tracking updates: 60 requests/minute

Rate limit info in response headers:
\`\`\`
X-RateLimit-Remaining: 29
X-RateLimit-Reset: 1705329600
