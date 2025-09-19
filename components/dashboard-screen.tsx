"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, Clock, Route, Award, TrendingUp, Play, Pause } from "lucide-react"

export function DashboardScreen() {
  const [currentTrip, setCurrentTrip] = useState<any>(null)
  const [isTracking, setIsTracking] = useState(false)

  const startTrip = () => {
    setCurrentTrip({
      id: Date.now(),
      startTime: new Date(),
      origin: "Current Location",
      destination: "Unknown",
      mode: "Walking",
      distance: 0,
    })
    setIsTracking(true)
  }

  const stopTrip = () => {
    setIsTracking(false)
    setCurrentTrip(null)
  }

  const stats = {
    totalDistance: 1247.5,
    totalTrips: 89,
    thisMonth: 156.2,
    avgSpeed: 45.3,
    co2Saved: 23.4,
    points: 2840,
  }

  const recentTrips = [
    {
      id: 1,
      origin: "Home",
      destination: "Office",
      mode: "Car",
      distance: 12.5,
      duration: "25 min",
      date: "Today",
      status: "completed",
    },
    {
      id: 2,
      origin: "Office",
      destination: "Mall",
      mode: "Metro",
      distance: 8.2,
      duration: "18 min",
      date: "Yesterday",
      status: "completed",
    },
    {
      id: 3,
      origin: "Home",
      destination: "Park",
      mode: "Walking",
      distance: 2.1,
      duration: "22 min",
      date: "2 days ago",
      status: "completed",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-balance">Good Morning, Traveler!</h1>
        <p className="text-muted-foreground text-pretty">Ready for your next adventure?</p>
      </div>

      {/* Current Trip Card */}
      {currentTrip ? (
        <Card className="border-accent/20 bg-accent/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Current Trip</CardTitle>
              <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                {isTracking ? "Tracking" : "Paused"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>From: {currentTrip.origin}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Route className="h-4 w-4" />
                  <span>Mode: {currentTrip.mode}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-accent">0.0 km</div>
                <div className="text-sm text-muted-foreground">Distance</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={isTracking ? "secondary" : "default"}
                onClick={() => setIsTracking(!isTracking)}
                className="flex-1"
              >
                {isTracking ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isTracking ? "Pause" : "Resume"}
              </Button>
              <Button variant="outline" onClick={stopTrip} className="flex-1 bg-transparent">
                End Trip
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                <MapPin className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Start Your Journey</h3>
                <p className="text-sm text-muted-foreground text-pretty">
                  Track your trip automatically or manually start a new journey
                </p>
              </div>
              <Button onClick={startTrip} className="w-full" size="lg">
                <Play className="h-4 w-4 mr-2" />
                Start New Trip
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-chart-1/10 rounded-full flex items-center justify-center">
                <Route className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalDistance}</div>
                <div className="text-sm text-muted-foreground">Total KM</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-chart-2/10 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalTrips}</div>
                <div className="text-sm text-muted-foreground">Total Trips</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-chart-3/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.thisMonth}</div>
                <div className="text-sm text-muted-foreground">This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                <Award className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.points}</div>
                <div className="text-sm text-muted-foreground">Points</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Progress</CardTitle>
          <CardDescription>Your travel activity this month</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Distance Goal</span>
              <span>{stats.thisMonth} / 200 km</span>
            </div>
            <Progress value={(stats.thisMonth / 200) * 100} className="h-2" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">CO₂ Saved</span>
              <div className="font-semibold text-green-600">{stats.co2Saved} kg</div>
            </div>
            <div>
              <span className="text-muted-foreground">Avg Speed</span>
              <div className="font-semibold">{stats.avgSpeed} km/h</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Trips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Trips</CardTitle>
          <CardDescription>Your latest travel activities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentTrips.map((trip) => (
            <div key={trip.id} className="flex items-center gap-3 p-3 rounded-lg border">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">
                  {trip.origin} → {trip.destination}
                </div>
                <div className="text-xs text-muted-foreground">
                  {trip.mode} • {trip.distance} km • {trip.duration}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">{trip.date}</div>
                <Badge variant="secondary" className="text-xs">
                  {trip.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
