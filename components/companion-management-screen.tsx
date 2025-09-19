"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Users, UserPlus, QrCode, Share2, MapPin, Clock, Route, MoreVertical, MessageCircle } from "lucide-react"

export function CompanionManagementScreen() {
  const [companions, setCompanions] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      avatar: "/diverse-woman-portrait.png",
      status: "online",
      totalTrips: 23,
      totalDistance: 456.7,
      lastSeen: "2 hours ago",
      isActive: true,
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike.chen@email.com",
      avatar: "/thoughtful-man.png",
      status: "offline",
      totalTrips: 18,
      totalDistance: 342.1,
      lastSeen: "1 day ago",
      isActive: false,
    },
    {
      id: 3,
      name: "Emma Wilson",
      email: "emma.w@email.com",
      avatar: "/diverse-woman-portrait.png",
      status: "traveling",
      totalTrips: 31,
      totalDistance: 678.9,
      lastSeen: "Active now",
      isActive: true,
    },
  ])

  const [groupTrips, setGroupTrips] = useState([
    {
      id: 1,
      name: "Weekend Getaway",
      participants: ["Sarah Johnson", "Mike Chen", "You"],
      destination: "Munnar, Kerala",
      startDate: "2024-01-15",
      endDate: "2024-01-17",
      status: "upcoming",
      totalDistance: 245.6,
      estimatedCost: 15000,
    },
    {
      id: 2,
      name: "Office Team Trip",
      participants: ["Emma Wilson", "Sarah Johnson", "You", "+3 others"],
      destination: "Goa",
      startDate: "2024-01-08",
      endDate: "2024-01-12",
      status: "completed",
      totalDistance: 1234.5,
      estimatedCost: 45000,
    },
  ])

  const [newCompanionEmail, setNewCompanionEmail] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showQRDialog, setShowQRDialog] = useState(false)

  const addCompanion = () => {
    // Add companion logic would go here
    console.log("Adding companion:", newCompanionEmail)
    setNewCompanionEmail("")
    setShowAddDialog(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "traveling":
        return "bg-accent"
      case "offline":
      default:
        return "bg-gray-400"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Online"
      case "traveling":
        return "Traveling"
      case "offline":
      default:
        return "Offline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Travel Companions</h1>
        <p className="text-muted-foreground text-pretty">Manage your travel companions and group trips</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:bg-accent/5 transition-colors">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <UserPlus className="h-6 w-6 text-accent" />
                  </div>
                  <div className="font-medium">Add Companion</div>
                  <div className="text-sm text-muted-foreground">Invite by email</div>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Travel Companion</DialogTitle>
              <DialogDescription>Invite someone to be your travel companion by email</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companion-email">Email Address</Label>
                <Input
                  id="companion-email"
                  type="email"
                  placeholder="companion@example.com"
                  value={newCompanionEmail}
                  onChange={(e) => setNewCompanionEmail(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={addCompanion} className="flex-1" disabled={!newCompanionEmail}>
                  Send Invite
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:bg-accent/5 transition-colors">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                    <QrCode className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="font-medium">QR Code</div>
                  <div className="text-sm text-muted-foreground">Share your code</div>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Your QR Code</DialogTitle>
              <DialogDescription>Share this QR code for others to add you as a companion</DialogDescription>
            </DialogHeader>
            <div className="text-center space-y-4">
              <div className="mx-auto w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                <QrCode className="h-24 w-24 text-muted-foreground" />
              </div>
              <div className="text-sm text-muted-foreground">User ID: TC-2024-001</div>
              <Button variant="outline" className="w-full bg-transparent">
                <Share2 className="h-4 w-4 mr-2" />
                Share QR Code
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="companions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="companions">My Companions</TabsTrigger>
          <TabsTrigger value="groups">Group Trips</TabsTrigger>
        </TabsList>

        <TabsContent value="companions" className="space-y-4">
          {/* Companions List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Travel Companions ({companions.length})</CardTitle>
              <CardDescription>People you travel with regularly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {companions.map((companion) => (
                <div key={companion.id} className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={companion.avatar || "/placeholder.svg"} alt={companion.name} />
                      <AvatarFallback>
                        {companion.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(companion.status)}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{companion.name}</div>
                    <div className="text-sm text-muted-foreground">{companion.email}</div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-muted-foreground">{companion.totalTrips} trips</span>
                      <span className="text-xs text-muted-foreground">{companion.totalDistance} km</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="text-xs">
                      {getStatusText(companion.status)}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">{companion.lastSeen}</div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Active Companions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Currently Active</CardTitle>
              <CardDescription>Companions who are currently traveling</CardDescription>
            </CardHeader>
            <CardContent>
              {companions.filter((c) => c.isActive).length > 0 ? (
                <div className="space-y-3">
                  {companions
                    .filter((c) => c.isActive)
                    .map((companion) => (
                      <div
                        key={companion.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 border border-accent/20"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={companion.avatar || "/placeholder.svg"} alt={companion.name} />
                          <AvatarFallback>
                            {companion.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">{companion.name}</div>
                          <div className="text-sm text-muted-foreground">Currently traveling</div>
                        </div>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No companions are currently active</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          {/* Group Trips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Group Trips</CardTitle>
              <CardDescription>Collaborative trips with multiple companions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {groupTrips.map((trip) => (
                <Card key={trip.id} className="border">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{trip.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4" />
                            {trip.destination}
                          </div>
                        </div>
                        <Badge variant={trip.status === "upcoming" ? "default" : "secondary"}>{trip.status}</Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {trip.startDate} - {trip.endDate}
                        </div>
                        <div className="flex items-center gap-1">
                          <Route className="h-4 w-4" />
                          {trip.totalDistance} km
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">Participants</div>
                          <div className="text-sm text-muted-foreground">{trip.participants.join(", ")}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">₹{trip.estimatedCost.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Estimated cost</div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Group Chat
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Create Group Trip */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Plan a Group Trip</h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    Create a new group trip and invite your companions
                  </p>
                </div>
                <Button className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Group Trip
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
