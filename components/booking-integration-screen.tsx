"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plane, Hotel, Car, Calendar, MapPin, ExternalLink, Search } from "lucide-react"

interface Booking {
  id: string
  booking_type: "flight" | "hotel" | "car" | "activity" | "restaurant"
  provider: string
  confirmation_number: string
  booking_details: any
  check_in_date?: string
  check_out_date?: string
  total_cost: number
  currency: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
}

interface SearchResult {
  id: string
  type: string
  name: string
  price: number
  rating: number
  image_url: string
  provider: string
  details: any
}

export function BookingIntegrationScreen() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"flight" | "hotel" | "car">("hotel")
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    // Load bookings from API
    setBookings([
      {
        id: "1",
        booking_type: "flight",
        provider: "Delta Airlines",
        confirmation_number: "DL123456",
        booking_details: {
          from: "SFO",
          to: "LAX",
          departure: "2024-02-15T10:30:00Z",
          arrival: "2024-02-15T12:45:00Z",
          seat: "12A",
        },
        total_cost: 299.99,
        currency: "USD",
        status: "confirmed",
      },
      {
        id: "2",
        booking_type: "hotel",
        provider: "Marriott",
        confirmation_number: "MAR789012",
        booking_details: {
          name: "Marriott Downtown",
          address: "123 Main St, Los Angeles, CA",
          room_type: "Deluxe King",
        },
        check_in_date: "2024-02-15T15:00:00Z",
        check_out_date: "2024-02-18T11:00:00Z",
        total_cost: 450.0,
        currency: "USD",
        status: "confirmed",
      },
    ])
  }

  const searchBookings = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch("/api/bookings/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery,
          type: searchType,
          check_in: "2024-02-15",
          check_out: "2024-02-18",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.results || [])
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const createBooking = async (result: SearchResult) => {
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_type: result.type,
          provider: result.provider,
          booking_details: result.details,
          total_cost: result.price,
        }),
      })

      if (response.ok) {
        loadBookings()
        alert("Booking created successfully!")
      }
    } catch (error) {
      console.error("Booking error:", error)
    }
  }

  const getBookingIcon = (type: string) => {
    switch (type) {
      case "flight":
        return <Plane className="h-5 w-5" />
      case "hotel":
        return <Hotel className="h-5 w-5" />
      case "car":
        return <Car className="h-5 w-5" />
      default:
        return <Calendar className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "cancelled":
        return "destructive"
      case "completed":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Book</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="search">Search destination or service</Label>
              <Input
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Los Angeles, hotels, flights..."
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as any)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="hotel">Hotels</option>
                <option value="flight">Flights</option>
                <option value="car">Car Rental</option>
              </select>
            </div>
          </div>
          <Button onClick={searchBookings} disabled={isSearching} className="w-full">
            <Search className="h-4 w-4 mr-2" />
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((result) => (
                <div key={result.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{result.name}</h3>
                      <p className="text-sm text-muted-foreground">{result.provider}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-sm">★ {result.rating}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${result.price}</p>
                      <p className="text-sm text-muted-foreground">per night</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => createBooking(result)} size="sm" className="flex-1">
                      Book Now
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Your Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getBookingIcon(booking.booking_type)}
                    <div>
                      <h3 className="font-medium">{booking.provider}</h3>
                      <p className="text-sm text-muted-foreground">Confirmation: {booking.confirmation_number}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={getStatusColor(booking.status) as any}>{booking.status}</Badge>
                    <p className="text-sm font-medium mt-1">
                      ${booking.total_cost} {booking.currency}
                    </p>
                  </div>
                </div>

                {booking.booking_type === "flight" && (
                  <div className="text-sm text-muted-foreground">
                    <p>
                      {booking.booking_details.from} → {booking.booking_details.to}
                    </p>
                    <p>Departure: {new Date(booking.booking_details.departure).toLocaleString()}</p>
                    <p>Seat: {booking.booking_details.seat}</p>
                  </div>
                )}

                {booking.booking_type === "hotel" && (
                  <div className="text-sm text-muted-foreground">
                    <p className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {booking.booking_details.address}
                    </p>
                    <p>Room: {booking.booking_details.room_type}</p>
                    <p>
                      Check-in: {booking.check_in_date ? new Date(booking.check_in_date).toLocaleDateString() : "N/A"}
                    </p>
                    <p>
                      Check-out:{" "}
                      {booking.check_out_date ? new Date(booking.check_out_date).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
