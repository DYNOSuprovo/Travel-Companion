"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Users, MapPin, Calendar, DollarSign, MessageCircle, UserPlus } from "lucide-react"

interface BuddyRequest {
  id: string
  requester_id: string
  requester_name: string
  requester_avatar?: string
  destination: string
  travel_dates: { start_date: string; end_date: string }
  interests: string[]
  budget_range?: { min: number; max: number; currency: string }
  description: string
  created_at: string
  expires_at: string
}

interface TravelBuddy {
  id: string
  user_id: string
  buddy_user_id: string
  buddy_name: string
  buddy_avatar?: string
  status: "pending" | "accepted" | "declined" | "blocked"
  created_at: string
}

export function TravelBuddyScreen() {
  const [buddyRequests, setBuddyRequests] = useState<BuddyRequest[]>([])
  const [myBuddies, setMyBuddies] = useState<TravelBuddy[]>([])
  const [newRequest, setNewRequest] = useState({
    destination: "",
    start_date: "",
    end_date: "",
    interests: "",
    budget_min: "",
    budget_max: "",
    description: "",
  })
  const [isCreatingRequest, setIsCreatingRequest] = useState(false)
  const [activeTab, setActiveTab] = useState<"discover" | "my-buddies" | "my-requests">("discover")

  useEffect(() => {
    loadBuddyData()
  }, [])

  const loadBuddyData = async () => {
    // Load buddy requests and connections
    setBuddyRequests([
      {
        id: "1",
        requester_id: "user1",
        requester_name: "Emma Wilson",
        requester_avatar: "/woman-traveler.png",
        destination: "Tokyo, Japan",
        travel_dates: { start_date: "2024-03-15", end_date: "2024-03-22" },
        interests: ["food", "culture", "photography", "temples"],
        budget_range: { min: 1500, max: 2500, currency: "USD" },
        description:
          "Looking for a travel buddy to explore Tokyo! I'm interested in trying authentic Japanese cuisine, visiting temples, and taking lots of photos. Would love to find someone with similar interests!",
        created_at: "2024-01-10T10:00:00Z",
        expires_at: "2024-02-10T10:00:00Z",
      },
      {
        id: "2",
        requester_id: "user2",
        requester_name: "Alex Rodriguez",
        requester_avatar: "/man-backpacker.jpg",
        destination: "Backpacking through Europe",
        travel_dates: { start_date: "2024-06-01", end_date: "2024-06-30" },
        interests: ["backpacking", "hostels", "nightlife", "museums"],
        budget_range: { min: 2000, max: 3000, currency: "USD" },
        description:
          "Planning a month-long backpacking trip through Europe! Looking for someone who loves adventure, doesn't mind staying in hostels, and wants to experience the nightlife and culture.",
        created_at: "2024-01-12T14:30:00Z",
        expires_at: "2024-02-12T14:30:00Z",
      },
    ])

    setMyBuddies([
      {
        id: "1",
        user_id: "current_user",
        buddy_user_id: "user3",
        buddy_name: "Sarah Kim",
        buddy_avatar: "/woman-hiker.jpg",
        status: "accepted",
        created_at: "2024-01-05T09:00:00Z",
      },
    ])
  }

  const createBuddyRequest = async () => {
    if (!newRequest.destination || !newRequest.start_date || !newRequest.end_date) return

    try {
      const response = await fetch("/api/social/buddy-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: newRequest.destination,
          travel_dates: {
            start_date: newRequest.start_date,
            end_date: newRequest.end_date,
          },
          interests: newRequest.interests.split(",").map((i) => i.trim()),
          budget_range: newRequest.budget_min
            ? {
                min: Number.parseFloat(newRequest.budget_min),
                max: Number.parseFloat(newRequest.budget_max),
                currency: "USD",
              }
            : null,
          description: newRequest.description,
        }),
      })

      if (response.ok) {
        setNewRequest({
          destination: "",
          start_date: "",
          end_date: "",
          interests: "",
          budget_min: "",
          budget_max: "",
          description: "",
        })
        setIsCreatingRequest(false)
        loadBuddyData()
      }
    } catch (error) {
      console.error("Create buddy request error:", error)
    }
  }

  const sendBuddyRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/social/buddy-requests/${requestId}/connect`, {
        method: "POST",
      })

      if (response.ok) {
        alert("Buddy request sent!")
      }
    } catch (error) {
      console.error("Send buddy request error:", error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === "discover" ? "default" : "ghost"}
          onClick={() => setActiveTab("discover")}
          className="rounded-b-none"
        >
          Discover Buddies
        </Button>
        <Button
          variant={activeTab === "my-buddies" ? "default" : "ghost"}
          onClick={() => setActiveTab("my-buddies")}
          className="rounded-b-none"
        >
          My Buddies
        </Button>
        <Button
          variant={activeTab === "my-requests" ? "default" : "ghost"}
          onClick={() => setActiveTab("my-requests")}
          className="rounded-b-none"
        >
          My Requests
        </Button>
      </div>

      {/* Discover Tab */}
      {activeTab === "discover" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Find Travel Buddies</h2>
            <Dialog open={isCreatingRequest} onOpenChange={setIsCreatingRequest}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Request
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Find Your Travel Buddy</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="destination">Destination</Label>
                    <Input
                      id="destination"
                      value={newRequest.destination}
                      onChange={(e) => setNewRequest({ ...newRequest, destination: e.target.value })}
                      placeholder="Where are you planning to go?"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start_date">Start Date</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={newRequest.start_date}
                        onChange={(e) => setNewRequest({ ...newRequest, start_date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end_date">End Date</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={newRequest.end_date}
                        onChange={(e) => setNewRequest({ ...newRequest, end_date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="interests">Interests</Label>
                    <Input
                      id="interests"
                      value={newRequest.interests}
                      onChange={(e) => setNewRequest({ ...newRequest, interests: e.target.value })}
                      placeholder="food, culture, adventure, nightlife (comma separated)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budget_min">Budget Min ($)</Label>
                      <Input
                        id="budget_min"
                        type="number"
                        value={newRequest.budget_min}
                        onChange={(e) => setNewRequest({ ...newRequest, budget_min: e.target.value })}
                        placeholder="1000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="budget_max">Budget Max ($)</Label>
                      <Input
                        id="budget_max"
                        type="number"
                        value={newRequest.budget_max}
                        onChange={(e) => setNewRequest({ ...newRequest, budget_max: e.target.value })}
                        placeholder="2000"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newRequest.description}
                      onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                      placeholder="Tell potential buddies about yourself and what you're looking for..."
                      className="min-h-24"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={createBuddyRequest} className="flex-1">
                      Create Request
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreatingRequest(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {buddyRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={request.requester_avatar || "/placeholder.svg"} />
                      <AvatarFallback>{request.requester_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{request.requester_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Posted {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{request.destination}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(request.travel_dates.start_date).toLocaleDateString()} -{" "}
                      {new Date(request.travel_dates.end_date).toLocaleDateString()}
                    </span>
                  </div>

                  {request.budget_range && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        ${request.budget_range.min} - ${request.budget_range.max} {request.budget_range.currency}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {request.interests.map((interest) => (
                      <Badge key={interest} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground">{request.description}</p>

                  <div className="flex gap-2">
                    <Button onClick={() => sendBuddyRequest(request.id)} className="flex-1">
                      <Users className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* My Buddies Tab */}
      {activeTab === "my-buddies" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">My Travel Buddies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myBuddies.map((buddy) => (
              <Card key={buddy.id}>
                <CardContent className="p-6 text-center">
                  <Avatar className="h-16 w-16 mx-auto mb-4">
                    <AvatarImage src={buddy.buddy_avatar || "/placeholder.svg"} />
                    <AvatarFallback>{buddy.buddy_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-medium">{buddy.buddy_name}</h3>
                  <Badge variant="default" className="mt-2">
                    {buddy.status}
                  </Badge>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Chat
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* My Requests Tab */}
      {activeTab === "my-requests" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">My Buddy Requests</h2>
          <p className="text-muted-foreground">Your active buddy requests will appear here.</p>
        </div>
      )}
    </div>
  )
}
