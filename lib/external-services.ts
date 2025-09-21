// Utility functions for external service integrations

export interface WeatherData {
  location: string
  current: {
    temperature: number
    condition: string
    humidity: number
    windSpeed: number
    visibility: number
    uvIndex: number
  }
  forecast: Array<{
    date: string
    high: number
    low: number
    condition: string
    precipitation: number
  }>
  alerts: string[]
}

export interface TrafficData {
  route: {
    origin: string
    destination: string
    transport_mode: string
  }
  duration: {
    normal: number
    current: number
    best_time: number
  }
  distance: number
  traffic_level: string
  incidents: Array<{
    type: string
    location: string
    severity: string
    delay: string
  }>
  alternative_routes: Array<{
    name: string
    duration: number
    distance: number
    traffic_level: string
  }>
}

export interface PlaceData {
  id: string
  name: string
  type: string
  address: string
  rating: number
  price_level: number
  distance: number
  opening_hours: {
    open_now: boolean
    hours: string
  }
  photos: string[]
  reviews_count: number
  amenities: string[]
  contact: {
    phone: string
    website: string
  }
}

// Helper functions for API integrations
export class ExternalServiceHelper {
  static async fetchWeather(location: string): Promise<WeatherData | null> {
    try {
      const response = await fetch(`/api/external/weather?location=${encodeURIComponent(location)}`)
      if (!response.ok) return null
      const data = await response.json()
      return data.weather
    } catch (error) {
      console.error("Failed to fetch weather:", error)
      return null
    }
  }

  static async fetchTraffic(origin: string, destination: string, transport_mode = "car"): Promise<TrafficData | null> {
    try {
      const params = new URLSearchParams({
        origin,
        destination,
        transport_mode,
      })
      const response = await fetch(`/api/external/traffic?${params}`)
      if (!response.ok) return null
      const data = await response.json()
      return data.traffic
    } catch (error) {
      console.error("Failed to fetch traffic:", error)
      return null
    }
  }

  static async searchPlaces(query: string, location?: string, type?: string): Promise<PlaceData[]> {
    try {
      const params = new URLSearchParams({ query })
      if (location) params.append("location", location)
      if (type) params.append("type", type)

      const response = await fetch(`/api/external/places?${params}`)
      if (!response.ok) return []
      const data = await response.json()
      return data.results || []
    } catch (error) {
      console.error("Failed to search places:", error)
      return []
    }
  }

  static async geocodeAddress(address: string) {
    try {
      const response = await fetch(`/api/external/geocoding?address=${encodeURIComponent(address)}`)
      if (!response.ok) return null
      const data = await response.json()
      return data.results?.[0] || null
    } catch (error) {
      console.error("Failed to geocode address:", error)
      return null
    }
  }

  static async reverseGeocode(lat: number, lon: number) {
    try {
      const response = await fetch(`/api/external/geocoding?lat=${lat}&lon=${lon}`)
      if (!response.ok) return null
      const data = await response.json()
      return data.results?.[0] || null
    } catch (error) {
      console.error("Failed to reverse geocode:", error)
      return null
    }
  }
}
