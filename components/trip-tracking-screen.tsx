"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { MapPin, Play, Pause, Square, Car, Train, Bus, Bike, Footprints, Plane } from "lucide-react"

export function TripTrackingScreen() {
  const [isTracking, setIsTracking] = useState(false)
  const [tripData, setTripData] = useState({
    startTime: null as Date | null,
    endTime: null as Date | null,
    origin: "",
    destination: "",
    mode: "walking",
    distance: 0,
    duration: 0,
    companions: [] as string[],
  })
  const [currentLocation, setCurrentLocation] = useState("Detecting location...")
  const [elapsedTime, setElapsedTime] = useState(0)

  // Simulate location detection
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentLocation("Kochi, Kerala, India")
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Timer for tracking
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTracking && tripData.startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - tripData.startTime!.getTime())
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTracking, tripData.startTime])

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    return `${hours.toString().padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}:${(seconds % 60)
      .toString()
      .padStart(2, "0")}`
  }

  const startTrip = () => {
    setTripData((prev) => ({
      ...prev,
      startTime: new Date(),
      origin: currentLocation,
    }))
    setIsTracking(true)
    setElapsedTime(0)
  }

  const pauseTrip = () => {
    setIsTracking(false)
  }

  const resumeTrip = () => {
    setIsTracking(true)
  }

  const stopTrip = () => {
    setTripData((prev) => ({
      ...prev,
      endTime: new Date(),
    }))
    setIsTracking(false)
    // Here you would save the trip data
    console.log("Trip completed:", tripData)
  }

  const transportModes = [
    { value: "walking", label: "Walking", icon: Footprints },
    { value: "car", label: "Car", icon: Car },
    { value: "bus", label: "Bus", icon: Bus },
    { value: "train", label: "Train", icon: Train },
    { value: "bike", label: "Bike", icon: Bike },
    { value: "flight", label: "Flight", icon: Plane },
  ]

  const selectedMode = transportModes.find((mode) => mode.value === tripData.mode)
  const ModeIcon = selectedMode?.icon || Footprints

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Trip Tracking</h1>
        <p className="text-muted-foreground text-pretty">Track your journey automatically or manually</p>
      </div>

      {/* Current Status Card */}
      <Card className={`${isTracking ? "border-accent/20 bg-accent/5" : ""}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Current Trip</CardTitle>
            <Badge variant={isTracking ? "default" : "secondary"} className={isTracking ? "bg-accent" : ""}>
              {isTracking ? "Tracking" : tripData.startTime ? "Paused" : "Ready"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Trip Timer */}
          <div className="text-center">
            <div className="text-4xl font-mono font-bold text-accent">{formatTime(elapsedTime)}</div>
            <div className="text-sm text-muted-foreground">Elapsed Time</div>
          </div>

          {/* Location Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <MapPin className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">Origin</div>
                <div className="text-sm text-muted-foreground">{tripData.origin || currentLocation}</div>
              </div>
            </div>
            {tripData.destination && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Destination</div>
                  <div className="text-sm text-muted-foreground">{tripData.destination}</div>
                </div>
              </div>
            )}
          </div>

          {/* Transport Mode */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
              <ModeIcon className="h-4 w-4 text-accent" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Transport Mode</div>
              <div className="text-sm text-muted-foreground">{selectedMode?.label}</div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-2 pt-4">
            {!tripData.startTime ? (
              <Button onClick={startTrip} className="flex-1" size="lg">
                <Play className="h-4 w-4 mr-2" />
                Start Trip
              </Button>
            ) : (
              <>
                <Button
                  variant={isTracking ? "secondary" : "default"}
                  onClick={isTracking ? pauseTrip : resumeTrip}
                  className="flex-1"
                >
                  {isTracking ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isTracking ? "Pause" : "Resume"}
                </Button>
                <Button variant="outline" onClick={stopTrip} className="flex-1 bg-transparent">
                  <Square className="h-4 w-4 mr-2" />
                  Stop Trip
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Trip Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trip Settings</CardTitle>
          <CardDescription>Configure your trip details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination (Optional)</Label>
            <Input
              id="destination"
              placeholder="Enter destination"
              value={tripData.destination}
              onChange={(e) => setTripData((prev) => ({ ...prev, destination: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transport-mode">Transport Mode</Label>
            <Select value={tripData.mode} onValueChange={(value) => setTripData((prev) => ({ ...prev, mode: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select transport mode" />
              </SelectTrigger>
              <SelectContent>
                {transportModes.map((mode) => {
                  const Icon = mode.icon
                  return (
                    <SelectItem key={mode.value} value={mode.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {mode.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Detection Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Auto-Detection</CardTitle>
          <CardDescription>Automatic trip detection settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium">GPS Tracking</div>
              <div className="text-sm text-muted-foreground">Automatically detect trip start/end</div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Active
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium">Motion Detection</div>
              <div className="text-sm text-muted-foreground">Use accelerometer for activity detection</div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Active
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium">Smart Mode Detection</div>
              <div className="text-sm text-muted-foreground">Automatically identify transport mode</div>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Live Stats */}
      {isTracking && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Live Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">0.0 km</div>
                <div className="text-sm text-muted-foreground">Distance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">0 km/h</div>
                <div className="text-sm text-muted-foreground">Speed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
