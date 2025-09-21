import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET /api/external/weather - Get weather information for a location
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
    const location = searchParams.get("location")
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")

    if (!location && (!lat || !lon)) {
      return NextResponse.json({ error: "Location or coordinates required" }, { status: 400 })
    }

    // Mock weather data (in production, integrate with OpenWeatherMap, WeatherAPI, etc.)
    const weatherData = {
      location: location || `${lat}, ${lon}`,
      current: {
        temperature: Math.round(Math.random() * 30 + 5), // 5-35°C
        condition: ["sunny", "cloudy", "rainy", "partly-cloudy"][Math.floor(Math.random() * 4)],
        humidity: Math.round(Math.random() * 40 + 40), // 40-80%
        windSpeed: Math.round(Math.random() * 20 + 5), // 5-25 km/h
        visibility: Math.round(Math.random() * 5 + 5), // 5-10 km
        uvIndex: Math.round(Math.random() * 10 + 1), // 1-11
      },
      forecast: Array.from({ length: 5 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        high: Math.round(Math.random() * 30 + 10),
        low: Math.round(Math.random() * 15 + 0),
        condition: ["sunny", "cloudy", "rainy", "partly-cloudy"][Math.floor(Math.random() * 4)],
        precipitation: Math.round(Math.random() * 100),
      })),
      alerts: Math.random() > 0.8 ? ["Heavy rain expected in the afternoon"] : [],
    }

    // Add travel recommendations based on weather
    const travelRecommendations = generateWeatherBasedRecommendations(weatherData)

    return NextResponse.json({
      weather: weatherData,
      travelRecommendations,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}

function generateWeatherBasedRecommendations(weather: any) {
  const recommendations = []

  if (weather.current.condition === "sunny" && weather.current.temperature > 20) {
    recommendations.push({
      type: "transport",
      message: "Perfect weather for cycling or walking!",
      suggestion: "Consider eco-friendly transport options",
    })
  }

  if (weather.current.condition === "rainy") {
    recommendations.push({
      type: "transport",
      message: "Rainy weather detected",
      suggestion: "Consider covered transport options like bus or car",
    })
  }

  if (weather.current.temperature < 5) {
    recommendations.push({
      type: "preparation",
      message: "Cold weather ahead",
      suggestion: "Pack warm clothes and plan for heated transport",
    })
  }

  if (weather.current.uvIndex > 7) {
    recommendations.push({
      type: "health",
      message: "High UV index",
      suggestion: "Use sunscreen and seek shade during peak hours",
    })
  }

  return recommendations
}
