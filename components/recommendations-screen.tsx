"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Lightbulb,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
  Hotel,
  Car,
  Utensils,
  Camera,
  Sparkles,
  RefreshCw,
  Heart,
  Share2,
} from "lucide-react"

export function RecommendationsScreen() {
  const [tripPreferences, setTripPreferences] = useState({
    destination: "",
    duration: [3],
    budget: [25000],
    travelStyle: "",
    interests: [] as string[],
    groupSize: [2],
    preferredSeason: "",
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [recommendations, setRecommendations] = useState<any>(null)

  const generateRecommendations = async () => {
    setIsGenerating(true)
    // Simulate ML model processing
    setTimeout(() => {
      setRecommendations({
        destination: {
          name: "Munnar, Kerala",
          description: "Perfect hill station for nature lovers with tea plantations and cool climate",
          bestTime: "October to March",
          rating: 4.8,
          image: "/munnar-landscape.jpg",
        },
        itinerary: [
          {
            day: 1,
            title: "Arrival & Tea Gardens",
            activities: ["Check-in at resort", "Visit Tata Tea Museum", "Evening at Tea Gardens"],
            cost: 3500,
          },
          {
            day: 2,
            title: "Adventure & Nature",
            activities: ["Eravikulam National Park", "Mattupetty Dam", "Echo Point"],
            cost: 2800,
          },
          {
            day: 3,
            title: "Local Culture & Departure",
            activities: ["Spice Gardens", "Local market shopping", "Departure"],
            cost: 2200,
          },
        ],
        accommodation: {
          name: "Munnar Tea Country Resort",
          rating: 4.5,
          pricePerNight: 4500,
          amenities: ["Free WiFi", "Restaurant", "Spa", "Mountain View"],
        },
        transportation: {
          mode: "Car Rental",
          cost: 6000,
          duration: "4 hours from Kochi",
          fuelCost: 1200,
        },
        totalEstimate: 24700,
        weatherForecast: {
          temperature: "15-25°C",
          conditions: "Pleasant with occasional mist",
          rainfall: "Low",
        },
      })
      setIsGenerating(false)
    }, 3000)
  }

  const interestOptions = [
    "Nature & Wildlife",
    "Adventure Sports",
    "Cultural Heritage",
    "Food & Cuisine",
    "Photography",
    "Relaxation & Spa",
    "Shopping",
    "Nightlife",
  ]

  const toggleInterest = (interest: string) => {
    setTripPreferences((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">AI Travel Recommendations</h1>
        <p className="text-muted-foreground text-pretty">
          Get personalized travel suggestions powered by machine learning
        </p>
      </div>

      <Tabs defaultValue="planner" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="planner">Trip Planner</TabsTrigger>
          <TabsTrigger value="smart">Smart Suggestions</TabsTrigger>
          <TabsTrigger value="saved">Saved Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="planner" className="space-y-4">
          {!recommendations ? (
            <>
              {/* Trip Preferences Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tell us about your ideal trip</CardTitle>
                  <CardDescription>
                    Our AI will create personalized recommendations based on your preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="destination">Preferred Destination (Optional)</Label>
                    <Input
                      id="destination"
                      placeholder="e.g., Kerala, Goa, Rajasthan"
                      value={tripPreferences.destination}
                      onChange={(e) => setTripPreferences((prev) => ({ ...prev, destination: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Trip Duration: {tripPreferences.duration[0]} days</Label>
                    <Slider
                      value={tripPreferences.duration}
                      onValueChange={(value) => setTripPreferences((prev) => ({ ...prev, duration: value }))}
                      max={14}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1 day</span>
                      <span>14 days</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Budget: ₹{tripPreferences.budget[0].toLocaleString()}</Label>
                    <Slider
                      value={tripPreferences.budget}
                      onValueChange={(value) => setTripPreferences((prev) => ({ ...prev, budget: value }))}
                      max={100000}
                      min={5000}
                      step={2500}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₹5,000</span>
                      <span>₹1,00,000</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="travel-style">Travel Style</Label>
                    <Select
                      value={tripPreferences.travelStyle}
                      onValueChange={(value) => setTripPreferences((prev) => ({ ...prev, travelStyle: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your travel style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="budget">Budget Traveler</SelectItem>
                        <SelectItem value="comfort">Comfort Seeker</SelectItem>
                        <SelectItem value="luxury">Luxury Experience</SelectItem>
                        <SelectItem value="adventure">Adventure Enthusiast</SelectItem>
                        <SelectItem value="cultural">Cultural Explorer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Group Size: {tripPreferences.groupSize[0]} people</Label>
                    <Slider
                      value={tripPreferences.groupSize}
                      onValueChange={(value) => setTripPreferences((prev) => ({ ...prev, groupSize: value }))}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Solo</span>
                      <span>10+ people</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Interests</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {interestOptions.map((interest) => (
                        <Button
                          key={interest}
                          variant={tripPreferences.interests.includes(interest) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleInterest(interest)}
                          className="justify-start"
                        >
                          {interest}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="season">Preferred Season</Label>
                    <Select
                      value={tripPreferences.preferredSeason}
                      onValueChange={(value) => setTripPreferences((prev) => ({ ...prev, preferredSeason: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any season" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spring">Spring (Mar-May)</SelectItem>
                        <SelectItem value="monsoon">Monsoon (Jun-Sep)</SelectItem>
                        <SelectItem value="winter">Winter (Oct-Feb)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={generateRecommendations} className="w-full" size="lg" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating Recommendations...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Get AI Recommendations
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* Generated Recommendations */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Your Personalized Trip Plan</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setRecommendations(null)}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    New Plan
                  </Button>
                </div>
              </div>

              {/* Destination Overview */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{recommendations.destination.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{recommendations.destination.rating}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-pretty mb-3">
                        {recommendations.destination.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Best time: {recommendations.destination.bestTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>₹{recommendations.totalEstimate.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Itinerary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Suggested Itinerary</CardTitle>
                  <CardDescription>Day-by-day plan optimized for your preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendations.itinerary.map((day: any, index: number) => (
                    <div key={day.day} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm font-medium text-accent-foreground">
                          {day.day}
                        </div>
                        {index < recommendations.itinerary.length - 1 && <div className="w-px h-16 bg-border mt-2" />}
                      </div>
                      <div className="flex-1 pb-6">
                        <h4 className="font-semibold mb-2">{day.title}</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground mb-2">
                          {day.activities.map((activity: string, i: number) => (
                            <li key={i}>• {activity}</li>
                          ))}
                        </ul>
                        <div className="text-sm font-medium">Estimated cost: ₹{day.cost.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Accommodation & Transportation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Hotel className="h-5 w-5" />
                      Accommodation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{recommendations.accommodation.name}</h4>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{recommendations.accommodation.rating}</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ₹{recommendations.accommodation.pricePerNight.toLocaleString()} per night
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {recommendations.accommodation.amenities.map((amenity: string) => (
                        <Badge key={amenity} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Car className="h-5 w-5" />
                      Transportation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{recommendations.transportation.mode}</h4>
                      <div className="text-sm font-medium">₹{recommendations.transportation.cost.toLocaleString()}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{recommendations.transportation.duration}</div>
                    <div className="text-sm text-muted-foreground">
                      Fuel cost: ₹{recommendations.transportation.fuelCost.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Weather & Cost Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Weather Forecast</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Temperature</span>
                      <span className="text-sm font-medium">{recommendations.weatherForecast.temperature}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Conditions</span>
                      <span className="text-sm font-medium">{recommendations.weatherForecast.conditions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Rainfall</span>
                      <span className="text-sm font-medium">{recommendations.weatherForecast.rainfall}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cost Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Accommodation</span>
                      <span className="text-sm font-medium">
                        ₹{(recommendations.accommodation.pricePerNight * tripPreferences.duration[0]).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Transportation</span>
                      <span className="text-sm font-medium">
                        ₹{recommendations.transportation.cost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Activities</span>
                      <span className="text-sm font-medium">
                        ₹
                        {recommendations.itinerary
                          .reduce((sum: number, day: any) => sum + day.cost, 0)
                          .toLocaleString()}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total Estimate</span>
                      <span>₹{recommendations.totalEstimate.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="smart" className="space-y-4">
          {/* Smart Suggestions based on user data */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personalized Suggestions</CardTitle>
              <CardDescription>Based on your travel history and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border border-accent/20 bg-accent/5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mt-1">
                    <TrendingUp className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Weekend Getaway to Wayanad</h4>
                    <p className="text-sm text-muted-foreground text-pretty mb-2">
                      Based on your love for nature and recent hill station visits, Wayanad offers perfect trekking and
                      wildlife experiences.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>2-3 days</span>
                      <span>₹8,000-12,000</span>
                      <span>Best: Oct-Mar</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Plan Trip
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-lg border">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <Camera className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Photography Tour in Hampi</h4>
                    <p className="text-sm text-muted-foreground text-pretty mb-2">
                      Perfect for your photography interests with ancient ruins and golden hour landscapes.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>3-4 days</span>
                      <span>₹15,000-20,000</span>
                      <span>Best: Nov-Feb</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Plan Trip
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-lg border">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <Utensils className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Culinary Journey in Kochi</h4>
                    <p className="text-sm text-muted-foreground text-pretty mb-2">
                      Explore Kerala's rich culinary heritage with cooking classes and food tours.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>2 days</span>
                      <span>₹6,000-9,000</span>
                      <span>Year-round</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Plan Trip
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trending Destinations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trending Destinations</CardTitle>
              <CardDescription>Popular places among travelers like you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Coorg", rating: 4.6, price: "₹12,000", image: "/coorg-landscape.jpg" },
                  { name: "Alleppey", rating: 4.7, price: "₹15,000", image: "/alleppey-backwaters.jpg" },
                  { name: "Ooty", rating: 4.5, price: "₹10,000", image: "/ooty-hills.jpg" },
                  { name: "Gokarna", rating: 4.4, price: "₹8,000", image: "/gokarna-beach.jpg" },
                ].map((destination) => (
                  <Card key={destination.name} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="w-full h-24 bg-muted rounded-lg mb-3 flex items-center justify-center">
                        <MapPin className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h4 className="font-semibold">{destination.name}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{destination.rating}</span>
                        </div>
                        <span className="text-xs font-medium">{destination.price}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          {/* Saved Trip Plans */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Saved Trip Plans</CardTitle>
              <CardDescription>Your bookmarked travel recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-pretty">
                  No saved trip plans yet. Generate some recommendations and save your favorites!
                </p>
                <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setRecommendations(null)}>
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Get Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
