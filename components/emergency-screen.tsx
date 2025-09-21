"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Phone, MapPin, Download, Wifi, WifiOff } from "lucide-react"

interface EmergencyContact {
  id: string
  name: string
  phone: string
  email?: string
  relationship: string
  is_primary: boolean
}

interface OfflineMap {
  id: string
  region_name: string
  bounds: { north: number; south: number; east: number; west: number }
  download_date: string
  file_size: number
  status: "downloading" | "ready" | "expired"
}

export function EmergencyScreen() {
  const [isOnline, setIsOnline] = useState(true)
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([])
  const [offlineMaps, setOfflineMaps] = useState<OfflineMap[]>([])
  const [sosActive, setSosActive] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // Monitor online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    setIsOnline(navigator.onLine)

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => console.error("Location error:", error),
      )
    }

    // Load emergency contacts and offline maps
    loadEmergencyData()

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const loadEmergencyData = async () => {
    // API calls to load emergency contacts and offline maps
    // Implementation would connect to backend APIs
    setEmergencyContacts([
      {
        id: "1",
        name: "John Doe",
        phone: "+1234567890",
        email: "john@example.com",
        relationship: "Emergency Contact",
        is_primary: true,
      },
    ])

    setOfflineMaps([
      {
        id: "1",
        region_name: "San Francisco Bay Area",
        bounds: { north: 37.8, south: 37.7, east: -122.3, west: -122.5 },
        download_date: new Date().toISOString(),
        file_size: 45000000,
        status: "ready",
      },
    ])
  }

  const triggerSOS = async () => {
    if (!currentLocation) {
      alert("Location not available")
      return
    }

    setSosActive(true)

    // Send SOS alert to backend
    try {
      const response = await fetch("/api/emergency/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: currentLocation,
          alert_type: "sos",
          message: "Emergency SOS triggered",
        }),
      })

      if (response.ok) {
        alert("SOS alert sent to emergency contacts!")
      }
    } catch (error) {
      console.error("SOS error:", error)
    }

    // Auto-cancel after 30 seconds if not manually cancelled
    setTimeout(() => setSosActive(false), 30000)
  }

  const downloadOfflineMap = async (region: string) => {
    // Trigger offline map download
    try {
      const response = await fetch("/api/offline/maps/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region_name: region,
          bounds: currentLocation
            ? {
                north: currentLocation.lat + 0.1,
                south: currentLocation.lat - 0.1,
                east: currentLocation.lng + 0.1,
                west: currentLocation.lng - 0.1,
              }
            : null,
        }),
      })

      if (response.ok) {
        alert("Offline map download started!")
        loadEmergencyData() // Refresh data
      }
    } catch (error) {
      console.error("Download error:", error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isOnline ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant={isOnline ? "default" : "destructive"}>{isOnline ? "Online" : "Offline"}</Badge>
          {!isOnline && (
            <p className="text-sm text-muted-foreground mt-2">
              You're offline. Emergency features and offline maps are still available.
            </p>
          )}
        </CardContent>
      </Card>

      {/* SOS Emergency Button */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Emergency SOS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={triggerSOS}
            disabled={sosActive}
            className={`w-full h-16 text-lg font-bold ${
              sosActive ? "bg-red-600 hover:bg-red-700 animate-pulse" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {sosActive ? "SOS ACTIVE - HELP ON THE WAY" : "EMERGENCY SOS"}
          </Button>
          {sosActive && (
            <Button onClick={() => setSosActive(false)} variant="outline" className="w-full">
              Cancel SOS
            </Button>
          )}
          <p className="text-sm text-muted-foreground">Press and hold to send your location to emergency contacts</p>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {emergencyContacts.map((contact) => (
            <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{contact.name}</p>
                <p className="text-sm text-muted-foreground">{contact.phone}</p>
                <p className="text-xs text-muted-foreground">{contact.relationship}</p>
              </div>
              {contact.is_primary && <Badge variant="secondary">Primary</Badge>}
            </div>
          ))}
          <Button variant="outline" className="w-full bg-transparent">
            Add Emergency Contact
          </Button>
        </CardContent>
      </Card>

      {/* Offline Maps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Offline Maps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {offlineMaps.map((map) => (
            <div key={map.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{map.region_name}</p>
                <p className="text-sm text-muted-foreground">{(map.file_size / 1000000).toFixed(1)} MB</p>
                <p className="text-xs text-muted-foreground">
                  Downloaded: {new Date(map.download_date).toLocaleDateString()}
                </p>
              </div>
              <Badge variant={map.status === "ready" ? "default" : "secondary"}>{map.status}</Badge>
            </div>
          ))}
          <Button onClick={() => downloadOfflineMap("Current Area")} variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download Current Area
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
