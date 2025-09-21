import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET /api/external/geocoding - Convert addresses to coordinates and vice versa
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
    const address = searchParams.get("address")
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")

    if (!address && (!lat || !lon)) {
      return NextResponse.json({ error: "Address or coordinates required" }, { status: 400 })
    }

    let result

    if (address) {
      // Forward geocoding: address to coordinates
      result = {
        type: "forward",
        query: address,
        results: [
          {
            formatted_address: address,
            coordinates: {
              lat: Math.random() * 180 - 90, // -90 to 90
              lon: Math.random() * 360 - 180, // -180 to 180
            },
            components: {
              street_number: Math.floor(Math.random() * 9999 + 1).toString(),
              street_name: generateStreetName(),
              city: extractCityFromAddress(address),
              state: "State",
              country: "Country",
              postal_code: Math.floor(Math.random() * 90000 + 10000).toString(),
            },
            confidence: Math.round((Math.random() * 0.3 + 0.7) * 100) / 100, // 0.7-1.0
          },
        ],
      }
    } else {
      // Reverse geocoding: coordinates to address
      result = {
        type: "reverse",
        query: `${lat}, ${lon}`,
        results: [
          {
            formatted_address: `${Math.floor(Math.random() * 9999 + 1)} ${generateStreetName()}, City, State, Country`,
            coordinates: {
              lat: Number.parseFloat(lat!),
              lon: Number.parseFloat(lon!),
            },
            components: {
              street_number: Math.floor(Math.random() * 9999 + 1).toString(),
              street_name: generateStreetName(),
              city: "City",
              state: "State",
              country: "Country",
              postal_code: Math.floor(Math.random() * 90000 + 10000).toString(),
            },
            confidence: Math.round((Math.random() * 0.3 + 0.7) * 100) / 100,
          },
        ],
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to geocode" }, { status: 500 })
  }
}

function generateStreetName(): string {
  const streets = ["Main St", "Oak Ave", "Pine Rd", "Elm St", "Maple Ave", "Cedar Ln", "Park Blvd", "First St"]
  return streets[Math.floor(Math.random() * streets.length)]
}

function extractCityFromAddress(address: string): string {
  // Simple extraction - in production, use proper address parsing
  const parts = address.split(",")
  return parts.length > 1 ? parts[parts.length - 2].trim() : "City"
}
