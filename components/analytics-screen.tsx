"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  Calendar,
  TrendingUp,
  MapPin,
  Clock,
  Route,
  Car,
  Train,
  Bus,
  Footprints,
  Plane,
  Download,
  Share2,
} from "lucide-react"

export function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedYear, setSelectedYear] = useState("2024")

  // Sample data for charts
  const monthlyData = [
    { month: "Jan", distance: 120, trips: 8, co2Saved: 15.2 },
    { month: "Feb", distance: 95, trips: 6, co2Saved: 12.1 },
    { month: "Mar", distance: 180, trips: 12, co2Saved: 22.8 },
    { month: "Apr", distance: 156, trips: 10, co2Saved: 19.8 },
    { month: "May", distance: 203, trips: 14, co2Saved: 25.7 },
    { month: "Jun", distance: 167, trips: 11, co2Saved: 21.2 },
  ]

  const transportModeData = [
    { name: "Car", value: 45, color: "#8b5cf6" },
    { name: "Walking", value: 25, color: "#06b6d4" },
    { name: "Bus", value: 15, color: "#10b981" },
    { name: "Train", value: 10, color: "#f59e0b" },
    { name: "Bike", value: 5, color: "#ef4444" },
  ]

  const weeklyActivityData = [
    { day: "Mon", trips: 3, distance: 25 },
    { day: "Tue", trips: 2, distance: 18 },
    { day: "Wed", trips: 4, distance: 32 },
    { day: "Thu", trips: 3, distance: 28 },
    { day: "Fri", trips: 5, distance: 45 },
    { day: "Sat", trips: 2, distance: 15 },
    { day: "Sun", trips: 1, distance: 8 },
  ]

  const yearlyComparison = [
    { year: "2022", distance: 1456, trips: 89, avgSpeed: 42.1 },
    { year: "2023", distance: 1789, trips: 112, avgSpeed: 44.8 },
    { year: "2024", distance: 1247, trips: 89, avgSpeed: 45.3 },
  ]

  const tripHistory = [
    {
      id: 1,
      date: "2024-01-15",
      origin: "Home",
      destination: "Office",
      mode: "Car",
      distance: 12.5,
      duration: "25 min",
      cost: 150,
      co2: 2.8,
    },
    {
      id: 2,
      date: "2024-01-15",
      origin: "Office",
      destination: "Mall",
      mode: "Metro",
      distance: 8.2,
      duration: "18 min",
      cost: 25,
      co2: 0.5,
    },
    {
      id: 3,
      date: "2024-01-14",
      origin: "Home",
      destination: "Park",
      mode: "Walking",
      distance: 2.1,
      duration: "22 min",
      cost: 0,
      co2: 0,
    },
    {
      id: 4,
      date: "2024-01-14",
      origin: "Park",
      destination: "Cafe",
      mode: "Bike",
      distance: 3.4,
      duration: "12 min",
      cost: 0,
      co2: 0,
    },
    {
      id: 5,
      date: "2024-01-13",
      origin: "Home",
      destination: "Airport",
      mode: "Taxi",
      distance: 45.6,
      duration: "1h 15min",
      cost: 850,
      co2: 10.2,
    },
  ]

  const getModeIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case "car":
      case "taxi":
        return Car
      case "train":
      case "metro":
        return Train
      case "bus":
        return Bus
      case "bike":
        return Bus
      case "walking":
        return Footprints
      case "flight":
        return Plane
      default:
        return MapPin
    }
  }

  const totalStats = {
    totalDistance: 1247.5,
    totalTrips: 89,
    totalCost: 15420,
    co2Saved: 156.7,
    avgSpeed: 45.3,
    favoriteMode: "Car",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Travel Analytics</h1>
          <p className="text-muted-foreground">Insights into your travel patterns and habits</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex gap-4">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-chart-1/10 rounded-full flex items-center justify-center">
                    <Route className="h-5 w-5 text-chart-1" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalStats.totalDistance}</div>
                    <div className="text-sm text-muted-foreground">Total Distance (km)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-chart-2/10 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-chart-2" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalStats.totalTrips}</div>
                    <div className="text-sm text-muted-foreground">Total Trips</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalStats.co2Saved}</div>
                    <div className="text-sm text-muted-foreground">CO₂ Saved (kg)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-chart-4/10 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-chart-4" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">₹{totalStats.totalCost.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Spent</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Distance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Distance Traveled</CardTitle>
              <CardDescription>Your travel distance over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="distance" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Transport Mode Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transport Mode Distribution</CardTitle>
              <CardDescription>How you prefer to travel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={transportModeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {transportModeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {transportModeData.map((mode) => (
                  <div key={mode.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: mode.color }} />
                    <span className="text-sm">{mode.name}</span>
                    <span className="text-sm text-muted-foreground ml-auto">{mode.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          {/* Weekly Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekly Activity Pattern</CardTitle>
              <CardDescription>Your travel patterns throughout the week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="trips" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Yearly Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Year-over-Year Comparison</CardTitle>
              <CardDescription>How your travel habits have evolved</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={yearlyComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="distance" stroke="#8b5cf6" name="Distance (km)" />
                  <Line type="monotone" dataKey="trips" stroke="#06b6d4" name="Trips" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Goals Progress</CardTitle>
              <CardDescription>Track your progress towards monthly targets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Distance Goal</span>
                  <span>156 / 200 km</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Trip Goal</span>
                  <span>11 / 15 trips</span>
                </div>
                <Progress value={73} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>CO₂ Reduction Goal</span>
                  <span>21.2 / 25 kg</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {/* Trip History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Trip History</CardTitle>
              <CardDescription>Detailed log of your recent travels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {tripHistory.map((trip) => {
                const ModeIcon = getModeIcon(trip.mode)
                return (
                  <div key={trip.id} className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <ModeIcon className="h-5 w-5 text-muted-foreground" />
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
                      <div className="text-sm font-medium">₹{trip.cost}</div>
                      <div className="text-xs text-muted-foreground">{trip.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-green-600">{trip.co2} kg CO₂</div>
                      <Badge variant="secondary" className="text-xs">
                        Completed
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Throwback Feature */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Travel Memories</CardTitle>
              <CardDescription>Your travel highlights from this time last year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">January 2023 Throwback</h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    You traveled 189 km across 12 trips, visiting 8 new places!
                  </p>
                </div>
                <Button variant="outline" className="bg-transparent">
                  View Full Throwback
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Smart Insights</CardTitle>
              <CardDescription>AI-powered analysis of your travel patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mt-1">
                    <TrendingUp className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium">Peak Travel Time</h4>
                    <p className="text-sm text-muted-foreground text-pretty">
                      You travel most frequently on Fridays between 5-7 PM. Consider planning important trips during
                      this time.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Eco-Friendly Progress</h4>
                    <p className="text-sm text-muted-foreground text-pretty">
                      Great job! You've increased your walking trips by 23% this month, saving 12.4 kg of CO₂.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Cost Optimization</h4>
                    <p className="text-sm text-muted-foreground text-pretty">
                      You could save ₹450/month by using public transport for your office commute instead of taxi.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personalized Recommendations</CardTitle>
              <CardDescription>Suggestions to improve your travel experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                  <Route className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Try a new route to work</div>
                  <div className="text-xs text-muted-foreground">Could save 5 minutes and ₹20 per trip</div>
                </div>
                <Button variant="outline" size="sm">
                  Explore
                </Button>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Footprints className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Walk more on weekends</div>
                  <div className="text-xs text-muted-foreground">Reach your 200km monthly goal faster</div>
                </div>
                <Button variant="outline" size="sm">
                  Set Goal
                </Button>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Train className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Metro pass discount available</div>
                  <div className="text-xs text-muted-foreground">Save 15% on your monthly commute</div>
                </div>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
