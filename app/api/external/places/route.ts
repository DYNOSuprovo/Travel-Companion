import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET /api/external/places - Search for places and points of interest
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
    const query = searchParams.get("query")
    const location = searchParams.get("location")
    const type = searchParams.get("type") // restaurant, attraction, hotel, etc.
    const radius = searchParams.get("radius") || "5000" // meters

    if (!query && !location) {
      return NextResponse.json({ error: "Query or location required" }, { status: 400 })
    }

    // Mock places data (in production, integrate with Google Places API, Foursquare, etc.)
    const placesData = {
      query: query || `Places near ${location}`,
      results: generateMockPlaces(type, location),
      total_results: Math.floor(Math.random() * 50 + 10),
      search_radius: `${radius}m`,
    }

    return NextResponse.json(placesData)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch places data" }, { status: 500 })
  }
}

function generateMockPlaces(type: string | null, location: string | null) {
  const placeTypes = type ? [type] : ["restaurant", "attraction", "hotel", "gas_station", "hospital", "pharmacy"]
  const places = []

  for (let i = 0; i < Math.min(10, Math.floor(Math.random() * 15 + 5)); i++) {
    const placeType = placeTypes[Math.floor(Math.random() * placeTypes.length)]
    const place = {
      id: `place_${i + 1}`,
      name: generatePlaceName(placeType),
      type: placeType,
      address: `${Math.floor(Math.random() * 9999 + 1)} ${generateStreetName()}, ${location || "City"}`,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0-5.0
      price_level: Math.floor(Math.random() * 4 + 1), // 1-4
      distance: Math.round(Math.random() * 5000 + 100), // 100-5100 meters
      opening_hours: {
        open_now: Math.random() > 0.3,
        hours: generateOpeningHours(placeType),
      },
      photos: [
        `https://placeholder.svg?height=200&width=300&query=${encodeURIComponent(generatePlaceName(placeType))}`,
      ],
      reviews_count: Math.floor(Math.random() * 500 + 10),
      amenities: generateAmenities(placeType),
      contact: {
        phone: `+1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
        website: `https://www.${generatePlaceName(placeType).toLowerCase().replace(/\s+/g, "")}.com`,
      },
    }
    places.push(place)
  }

  return places.sort((a, b) => b.rating - a.rating)
}

function generatePlaceName(type: string): string {
  const names = {
    restaurant: ["The Golden Fork", "Bella Vista", "Ocean Breeze Cafe", "Mountain View Bistro", "Urban Kitchen"],
    attraction: ["Historic Museum", "City Art Gallery", "Riverside Park", "Adventure Center", "Cultural District"],
    hotel: ["Grand Plaza Hotel", "Comfort Inn", "Boutique Suites", "Riverside Lodge", "City Center Hotel"],
    gas_station: ["QuickFuel", "City Gas", "Highway Stop", "FuelMart", "Express Station"],
    hospital: ["General Hospital", "Medical Center", "Community Health", "Regional Hospital", "Emergency Care"],
    pharmacy: ["City Pharmacy", "HealthMart", "Quick Meds", "Community Pharmacy", "MedCenter"],
  }

  const typeNames = names[type as keyof typeof names] || ["Local Business", "Service Center", "Community Hub"]
  return typeNames[Math.floor(Math.random() * typeNames.length)]
}

function generateStreetName(): string {
  const streets = ["Main St", "Oak Ave", "Pine Rd", "Elm St", "Maple Ave", "Cedar Ln", "Park Blvd", "First St"]
  return streets[Math.floor(Math.random() * streets.length)]
}

function generateOpeningHours(type: string) {
  const hours = {
    restaurant: "11:00 AM - 10:00 PM",
    attraction: "9:00 AM - 6:00 PM",
    hotel: "24 hours",
    gas_station: "6:00 AM - 11:00 PM",
    hospital: "24 hours",
    pharmacy: "8:00 AM - 9:00 PM",
  }

  return hours[type as keyof typeof hours] || "9:00 AM - 6:00 PM"
}

function generateAmenities(type: string) {
  const amenities = {
    restaurant: ["WiFi", "Parking", "Outdoor Seating", "Takeout", "Delivery"],
    attraction: ["Parking", "Gift Shop", "Guided Tours", "Wheelchair Accessible"],
    hotel: ["WiFi", "Parking", "Pool", "Gym", "Restaurant", "Room Service"],
    gas_station: ["Convenience Store", "Car Wash", "ATM", "Restrooms"],
    hospital: ["Emergency Room", "Parking", "Pharmacy", "Cafeteria"],
    pharmacy: ["Drive-through", "Parking", "Photo Services", "Health Clinic"],
  }

  const typeAmenities = amenities[type as keyof typeof amenities] || ["Parking", "WiFi"]
  return typeAmenities.slice(0, Math.floor(Math.random() * typeAmenities.length) + 1)
}
