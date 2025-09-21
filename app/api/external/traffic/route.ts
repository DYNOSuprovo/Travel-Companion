import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET /api/external/traffic - Get traffic information for a route
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const origin = searchParams.get("origin")
    const destination = searchParams.get("destination")
    const transport_mode = searchParams.get("transport_mode") || "car"

    if (!origin || !destination) {
      return NextResponse.json({ error: "Origin and destination required" }, { status: 400 })
    }

    // Mock traffic data (in production, integrate with Google Maps API, MapBox, etc.)
    const trafficData = {
      route: {
        origin,
        destination,
        transport_mode,
      },
      duration: {
        normal: Math.round(Math.random() * 60 + 30), // 30-90 minutes
        current: Math.round(Math.random() * 90 + 30), // 30-120 minutes
        best_time: Math.round(Math.random() * 45 + 20), // 20-65 minutes
      },
      distance: Math.round(Math.random() * 50 + 10), // 10-60 km
      traffic_level: ["light", "moderate", "heavy"][Math.floor(Math.random() * 3)],
      incidents:
        Math.random() > 0.7
          ? [
              {
                type: "accident",
                location: "Highway 101 near Exit 15",
                severity: "moderate",
                delay: "15 minutes",
              },
            ]
          : [],
      alternative_routes: [
        {
          name: "Route via Main Street",
          duration: Math.round(Math.random() * 80 + 35),
          distance: Math.round(Math.random() * 45 + 12),
          traffic_level: "light",
        },
        {
          name: "Route via Highway 2",
          duration: Math.round(Math.random() * 70 + 40),
          distance: Math.round(Math.random() * 55 + 15),
          traffic_level: "moderate",
        },
      ],
      best_departure_times: [
        { time: "07:00", duration: Math.round(Math.random() * 45 + 25) },
        { time: "09:30", duration: Math.round(Math.random() * 40 + 30) },
        { time: "14:00", duration: Math.round(Math.random() * 35 + 25) },
      ],
    }

    // Add transport-specific recommendations
    const transportRecommendations = generateTransportRecommendations(trafficData, transport_mode)

    return NextResponse.json({
      traffic: trafficData,
      recommendations: transportRecommendations,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch traffic data" }, { status: 500 })
  }
}

function generateTransportRecommendations(traffic: any, transport_mode: string) {
  const recommendations = []

  if (traffic.traffic_level === "heavy" && transport_mode === "car") {
    recommendations.push({
      type: "alternative_transport",
      message: "Heavy traffic detected",
      suggestion: "Consider public transport or cycling for faster travel",
    })
  }

  if (traffic.incidents.length > 0) {
    recommendations.push({
      type: "route_change",
      message: "Traffic incidents on main route",
      suggestion: "Use alternative routes to avoid delays",
    })
  }

  if (transport_mode === "walking" && traffic.distance > 5) {
    recommendations.push({
      type: "transport_mode",
      message: "Long walking distance",
      suggestion: "Consider cycling or public transport for this distance",
    })
  }

  return recommendations
}
