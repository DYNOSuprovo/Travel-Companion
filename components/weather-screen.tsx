"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Wind,
  Thermometer,
  Droplets,
  AlertTriangle,
  MapPin,
  Navigation,
} from "lucide-react"

export function WeatherScreen() {
  const [selectedLocation, setSelectedLocation] = useState("Kochi, Kerala")
  const [searchLocation, setSearchLocation] = useState("")

  const currentWeather = {
    location: "Kochi, Kerala",
    temperature: 28,
    condition: "Partly Cloudy",
    humidity: 75,
    windSpeed: 12,
    visibility: 8,
    uvIndex: 6,
    pressure: 1013,
    feelsLike: 32,
    icon: Cloud,
  }

  const hourlyForecast = [
    { time: "Now", temp: 28, condition: "Partly Cloudy", icon: Cloud, rain: 10 },
    { time: "1 PM", temp: 30, condition: "Sunny", icon: Sun, rain: 5 },
    { time: "2 PM", temp: 32, condition: "Sunny", icon: Sun, rain: 0 },
    { time: "3 PM", temp: 31, condition: "Cloudy", icon: Cloud, rain: 15 },
    { time: "4 PM", temp: 29, condition: "Light Rain", icon: CloudRain, rain: 60 },
    { time: "5 PM", temp: 27, condition: "Rain", icon: CloudRain, rain: 80 },
  ]

  const weeklyForecast = [
    { day: "Today", high: 32, low: 24, condition: "Partly Cloudy", icon: Cloud, rain: 20 },
    { day: "Tomorrow", high: 30, low: 23, condition: "Rainy", icon: CloudRain, rain: 70 },
    { day: "Wednesday", high: 29, low: 22, condition: "Cloudy", icon: Cloud, rain: 40 },
    { day: "Thursday", high: 31, low: 24, condition: "Sunny", icon: Sun, rain: 10 },
    { day: "Friday", high: 33, low: 25, condition: "Sunny", icon: Sun, rain: 5 },
    { day: "Saturday", high: 28, low: 21, condition: "Rainy", icon: CloudRain, rain: 85 },
    { day: "Sunday", high: 26, low: 20, condition: "Heavy Rain", icon: CloudRain, rain: 95 },
  ]

  const alerts = [
    {
      id: 1,
      type: "weather",
      severity: "moderate",
      title: "Heavy Rain Expected",
      description: "Heavy rainfall expected between 4 PM - 8 PM today. Plan your travel accordingly.",
      validUntil: "6:00 PM today",
    },
    {
      id: 2,
      type: "traffic",
      severity: "high",
      title: "Traffic Alert - MG Road",
      description: "Heavy traffic congestion on MG Road due to waterlogging. Consider alternate routes.",
      validUntil: "8:00 PM today",
    },
  ]

  const travelRecommendations = [
    {
      route: "Home to Office",
      recommendation: "Leave 15 minutes early due to expected rain",
      bestTime: "Before 4:00 PM",
      alternateRoute: "Via Bypass Road",
    },
    {
      route: "Office to Mall",
      recommendation: "Use covered walkways, carry umbrella",
      bestTime: "After 8:00 PM",
      alternateRoute: "Metro recommended",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-red-200 bg-red-50"
      case "moderate":
        return "border-yellow-200 bg-yellow-50"
      case "low":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getConditionIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return Sun
      case "cloudy":
      case "partly cloudy":
        return Cloud
      case "rainy":
      case "light rain":
      case "heavy rain":
        return CloudRain
      case "snow":
        return CloudSnow
      default:
        return Cloud
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Weather & Safety</h1>
        <p className="text-muted-foreground text-pretty">Real-time weather and travel safety information</p>
      </div>

      {/* Location Search */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search location..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline">
              <Navigation className="h-4 w-4 mr-2" />
              Current Location
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Weather Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{alert.title}</div>
                    <div className="text-sm text-pretty">{alert.description}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {alert.validUntil}
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current">Current</TabsTrigger>
          <TabsTrigger value="hourly">Hourly</TabsTrigger>
          <TabsTrigger value="weekly">7-Day</TabsTrigger>
          <TabsTrigger value="travel">Travel Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          {/* Current Weather */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {currentWeather.location}
              </CardTitle>
              <CardDescription>Current weather conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mb-6">
                <div className="text-center">
                  <currentWeather.icon className="h-16 w-16 mx-auto mb-2 text-accent" />
                  <div className="text-3xl font-bold">{currentWeather.temperature}°C</div>
                  <div className="text-sm text-muted-foreground">{currentWeather.condition}</div>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Feels like</span>
                    <span className="font-medium">{currentWeather.feelsLike}°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Humidity</span>
                    <span className="font-medium">{currentWeather.humidity}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Wind Speed</span>
                    <span className="font-medium">{currentWeather.windSpeed} km/h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Visibility</span>
                    <span className="font-medium">{currentWeather.visibility} km</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Thermometer className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Pressure</div>
                    <div className="font-medium">{currentWeather.pressure} hPa</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Sun className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">UV Index</div>
                    <div className="font-medium">{currentWeather.uvIndex}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hourly" className="space-y-4">
          {/* Hourly Forecast */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hourly Forecast</CardTitle>
              <CardDescription>Weather conditions for the next 6 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {hourlyForecast.map((hour, index) => {
                  const Icon = hour.icon
                  return (
                    <div key={index} className="text-center p-3 rounded-lg border">
                      <div className="text-sm font-medium mb-2">{hour.time}</div>
                      <Icon className="h-8 w-8 mx-auto mb-2 text-accent" />
                      <div className="font-bold">{hour.temp}°C</div>
                      <div className="text-xs text-muted-foreground mb-1">{hour.condition}</div>
                      <div className="text-xs text-blue-600">{hour.rain}% rain</div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          {/* Weekly Forecast */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">7-Day Forecast</CardTitle>
              <CardDescription>Extended weather outlook</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {weeklyForecast.map((day, index) => {
                const Icon = day.icon
                return (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className="w-20 text-sm font-medium">{day.day}</div>
                    <Icon className="h-6 w-6 text-accent" />
                    <div className="flex-1">
                      <div className="font-medium">{day.condition}</div>
                      <div className="text-sm text-muted-foreground">{day.rain}% chance of rain</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{day.high}°</div>
                      <div className="text-sm text-muted-foreground">{day.low}°</div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="travel" className="space-y-4">
          {/* Travel Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Smart Travel Recommendations</CardTitle>
              <CardDescription>AI-powered suggestions based on weather and traffic</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {travelRecommendations.map((rec, index) => (
                <div key={index} className="p-4 rounded-lg border">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold">{rec.route}</h4>
                    <Badge variant="secondary">Recommended</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 text-pretty">{rec.recommendation}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Best time:</span>
                      <div className="font-medium">{rec.bestTime}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Alternate route:</span>
                      <div className="font-medium">{rec.alternateRoute}</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Safety Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Safety Tips</CardTitle>
              <CardDescription>Stay safe during your travels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <Droplets className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-medium text-blue-900">Rainy Weather</h4>
                  <p className="text-sm text-blue-700 text-pretty">
                    Carry an umbrella, wear non-slip shoes, and allow extra travel time.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                <Sun className="h-5 w-5 text-yellow-600 mt-1" />
                <div>
                  <h4 className="font-medium text-yellow-900">High UV Index</h4>
                  <p className="text-sm text-yellow-700 text-pretty">
                    Use sunscreen, wear sunglasses, and stay hydrated during outdoor activities.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                <Wind className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-medium text-green-900">Windy Conditions</h4>
                  <p className="text-sm text-green-700 text-pretty">
                    Secure loose items and be cautious when driving or cycling.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
