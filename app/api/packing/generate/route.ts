import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { destination, travel_dates, activities } = await request.json()

    // Mock weather forecast (in a real app, you'd call a weather API)
    const mockWeatherForecast = [
      {
        date: travel_dates.start_date,
        temperature: { min: 15, max: 25 },
        condition: "sunny",
        precipitation: 10,
      },
      {
        date: new Date(new Date(travel_dates.start_date).getTime() + 86400000).toISOString().split("T")[0],
        temperature: { min: 12, max: 22 },
        condition: "cloudy",
        precipitation: 30,
      },
    ]

    // Generate smart packing list based on destination, weather, and activities
    const baseItems = [
      { name: "Passport", category: "documents", is_essential: true, quantity: 1 },
      { name: "Travel insurance", category: "documents", is_essential: true, quantity: 1 },
      { name: "Phone charger", category: "electronics", is_essential: true, quantity: 1 },
      { name: "Underwear", category: "clothing", is_essential: true, quantity: 7 },
      { name: "Socks", category: "clothing", is_essential: true, quantity: 7 },
    ]

    // Add weather-specific items
    const weatherItems = []
    if (mockWeatherForecast.some((day) => day.precipitation > 50)) {
      weatherItems.push({
        name: "Rain jacket",
        category: "clothing",
        is_essential: true,
        quantity: 1,
        notes: "Weather forecast shows rain during your trip",
      })
      weatherItems.push({
        name: "Umbrella",
        category: "accessories",
        is_essential: false,
        quantity: 1,
        notes: "Backup for rainy days",
      })
    }

    if (mockWeatherForecast.some((day) => day.temperature.max > 25)) {
      weatherItems.push({
        name: "Sunscreen",
        category: "toiletries",
        is_essential: true,
        quantity: 1,
        notes: "High temperatures expected",
      })
      weatherItems.push({
        name: "Sunglasses",
        category: "accessories",
        is_essential: false,
        quantity: 1,
      })
    }

    // Add activity-specific items
    const activityItems = []
    if (activities.includes("hiking") || activities.includes("walking")) {
      activityItems.push({
        name: "Comfortable walking shoes",
        category: "footwear",
        is_essential: true,
        quantity: 1,
        notes: "Essential for your planned walking activities",
      })
      activityItems.push({
        name: "Blister patches",
        category: "health",
        is_essential: false,
        quantity: 1,
      })
    }

    if (activities.includes("swimming") || activities.includes("beach")) {
      activityItems.push({
        name: "Swimwear",
        category: "clothing",
        is_essential: true,
        quantity: 2,
      })
      activityItems.push({
        name: "Beach towel",
        category: "accessories",
        is_essential: false,
        quantity: 1,
      })
    }

    if (activities.includes("formal") || activities.includes("dining")) {
      activityItems.push({
        name: "Formal outfit",
        category: "clothing",
        is_essential: false,
        quantity: 1,
        notes: "For formal dining or events",
      })
    }

    // Combine all items
    const allItems = [...baseItems, ...weatherItems, ...activityItems].map((item, index) => ({
      id: `item_${index}`,
      ...item,
      is_packed: false,
    }))

    // Create packing list in database
    const { data: packingList, error } = await supabase
      .from("packing_lists")
      .insert({
        user_id: user.id,
        destination,
        travel_dates,
        weather_forecast: mockWeatherForecast,
        activities,
        items: allItems,
        is_ai_generated: true,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to create packing list" }, { status: 500 })
    }

    return NextResponse.json({
      packing_list: packingList,
      weather_forecast: mockWeatherForecast,
      items_count: allItems.length,
      essential_items_count: allItems.filter((item) => item.is_essential).length,
    })
  } catch (error) {
    console.error("Generate packing list error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
