import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { query, type, check_in, check_out } = await request.json()

    // Mock search results - in a real app, you'd integrate with booking APIs
    const mockResults = [
      {
        id: "1",
        type: "hotel",
        name: "Grand Hotel Downtown",
        price: 150,
        rating: 4.5,
        image_url: "/grand-hotel-exterior.png",
        provider: "Booking.com",
        details: {
          address: "123 Main St, Los Angeles, CA",
          amenities: ["WiFi", "Pool", "Gym", "Parking"],
          room_type: "Standard King",
        },
      },
      {
        id: "2",
        type: "hotel",
        name: "Boutique Inn",
        price: 120,
        rating: 4.2,
        image_url: "/boutique-hotel.png",
        provider: "Expedia",
        details: {
          address: "456 Oak Ave, Los Angeles, CA",
          amenities: ["WiFi", "Restaurant", "Bar"],
          room_type: "Queen Room",
        },
      },
    ]

    // Filter results based on search type
    const filteredResults = mockResults.filter((result) => result.type === type)

    return NextResponse.json({
      results: filteredResults,
      total: filteredResults.length,
    })
  } catch (error) {
    console.error("Booking search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
