"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Heart, Activity, Clock, Droplets, Moon, Zap, Smile, AlertCircle, Plus, MapPin } from "lucide-react"

interface HealthProfile {
  id: string
  medical_conditions: string[]
  medications: string[]
  allergies: string[]
  dietary_restrictions: string[]
  emergency_contact_name?: string
  emergency_contact_phone?: string
  blood_type?: string
}

interface FitnessActivity {
  id: string
  activity_type: string
  duration_minutes: number
  distance_km?: number
  calories_burned?: number
  location?: { name: string }
  date: string
}

interface HealthReminder {
  id: string
  reminder_type: string
  title: string
  description?: string
  frequency: string
  time_of_day?: string
  is_active: boolean
  last_completed?: string
}

interface WellnessMetric {
  id: string
  metric_type: string
  value: number
  unit: string
  date: string
}

export function HealthWellnessScreen() {
  const [healthProfile, setHealthProfile] = useState<HealthProfile | null>(null)
  const [fitnessActivities, setFitnessActivities] = useState<FitnessActivity[]>([])
  const [healthReminders, setHealthReminders] = useState<HealthReminder[]>([])
  const [wellnessMetrics, setWellnessMetrics] = useState<WellnessMetric[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [isAddingActivity, setIsAddingActivity] = useState(false)
  const [isAddingReminder, setIsAddingReminder] = useState(false)

  const [newActivity, setNewActivity] = useState({
    activity_type: "walking",
    duration_minutes: "",
    distance_km: "",
    calories_burned: "",
    location: "",
    date: new Date().toISOString().split("T")[0],
  })

  const [newReminder, setNewReminder] = useState({
    reminder_type: "medication",
    title: "",
    description: "",
    frequency: "daily",
    time_of_day: "09:00",
  })

  useEffect(() => {
    loadHealthData()
  }, [])

  const loadHealthData = async () => {
    // Load health profile, activities, reminders, and metrics
    // Mock data for demonstration
    setHealthProfile({
      id: "1",
      medical_conditions: ["Hypertension"],
      medications: ["Lisinopril 10mg"],
      allergies: ["Peanuts", "Shellfish"],
      dietary_restrictions: ["Vegetarian"],
      emergency_contact_name: "Jane Doe",
      emergency_contact_phone: "+1234567890",
      blood_type: "O+",
    })

    setFitnessActivities([
      {
        id: "1",
        activity_type: "walking",
        duration_minutes: 45,
        distance_km: 3.2,
        calories_burned: 180,
        location: { name: "Central Park" },
        date: "2024-01-15",
      },
      {
        id: "2",
        activity_type: "running",
        duration_minutes: 30,
        distance_km: 5.0,
        calories_burned: 300,
        location: { name: "Riverside Trail" },
        date: "2024-01-14",
      },
    ])

    setHealthReminders([
      {
        id: "1",
        reminder_type: "medication",
        title: "Take Lisinopril",
        description: "10mg with breakfast",
        frequency: "daily",
        time_of_day: "08:00",
        is_active: true,
        last_completed: "2024-01-15T08:00:00Z",
      },
      {
        id: "2",
        reminder_type: "hydration",
        title: "Drink Water",
        description: "Stay hydrated throughout the day",
        frequency: "daily",
        time_of_day: "10:00",
        is_active: true,
      },
    ])

    setWellnessMetrics([
      { id: "1", metric_type: "sleep_hours", value: 7.5, unit: "hours", date: "2024-01-15" },
      { id: "2", metric_type: "water_intake", value: 2.1, unit: "liters", date: "2024-01-15" },
      { id: "3", metric_type: "stress_level", value: 3, unit: "1-10", date: "2024-01-15" },
      { id: "4", metric_type: "energy_level", value: 8, unit: "1-10", date: "2024-01-15" },
      { id: "5", metric_type: "mood", value: 7, unit: "1-10", date: "2024-01-15" },
    ])
  }

  const addFitnessActivity = async () => {
    if (!newActivity.activity_type || !newActivity.duration_minutes) return

    try {
      const response = await fetch("/api/health/fitness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity_type: newActivity.activity_type,
          duration_minutes: Number.parseInt(newActivity.duration_minutes),
          distance_km: newActivity.distance_km ? Number.parseFloat(newActivity.distance_km) : null,
          calories_burned: newActivity.calories_burned ? Number.parseInt(newActivity.calories_burned) : null,
          location: newActivity.location ? { name: newActivity.location } : null,
          date: newActivity.date,
        }),
      })

      if (response.ok) {
        setNewActivity({
          activity_type: "walking",
          duration_minutes: "",
          distance_km: "",
          calories_burned: "",
          location: "",
          date: new Date().toISOString().split("T")[0],
        })
        setIsAddingActivity(false)
        loadHealthData()
      }
    } catch (error) {
      console.error("Add fitness activity error:", error)
    }
  }

  const addHealthReminder = async () => {
    if (!newReminder.title) return

    try {
      const response = await fetch("/api/health/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReminder),
      })

      if (response.ok) {
        setNewReminder({
          reminder_type: "medication",
          title: "",
          description: "",
          frequency: "daily",
          time_of_day: "09:00",
        })
        setIsAddingReminder(false)
        loadHealthData()
      }
    } catch (error) {
      console.error("Add health reminder error:", error)
    }
  }

  const completeReminder = async (reminderId: string) => {
    try {
      await fetch(`/api/health/reminders/${reminderId}/complete`, {
        method: "POST",
      })
      loadHealthData()
    } catch (error) {
      console.error("Complete reminder error:", error)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "running":
        return <Activity className="h-4 w-4" />
      case "walking":
        return <Activity className="h-4 w-4" />
      case "cycling":
        return <Activity className="h-4 w-4" />
      case "swimming":
        return <Droplets className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getMetricIcon = (type: string) => {
    switch (type) {
      case "sleep_hours":
        return <Moon className="h-4 w-4" />
      case "water_intake":
        return <Droplets className="h-4 w-4" />
      case "energy_level":
        return <Zap className="h-4 w-4" />
      case "mood":
        return <Smile className="h-4 w-4" />
      default:
        return <Heart className="h-4 w-4" />
    }
  }

  const getTodaysMetrics = () => {
    const today = new Date().toISOString().split("T")[0]
    return wellnessMetrics.filter((metric) => metric.date === today)
  }

  const getWeeklyActivitySummary = () => {
    const totalDuration = fitnessActivities.reduce((sum, activity) => sum + activity.duration_minutes, 0)
    const totalDistance = fitnessActivities.reduce((sum, activity) => sum + (activity.distance_km || 0), 0)
    const totalCalories = fitnessActivities.reduce((sum, activity) => sum + (activity.calories_burned || 0), 0)

    return { totalDuration, totalDistance, totalCalories }
  }

  const weeklyStats = getWeeklyActivitySummary()
  const todaysMetrics = getTodaysMetrics()

  return (
    <div className="p-6 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="fitness">Fitness</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Today's Wellness Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Wellness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {todaysMetrics.map((metric) => (
                  <div key={metric.id} className="text-center">
                    <div className="flex justify-center mb-2">{getMetricIcon(metric.metric_type)}</div>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-sm text-muted-foreground capitalize">{metric.metric_type.replace("_", " ")}</p>
                    <p className="text-xs text-muted-foreground">{metric.unit}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle>This Week's Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Clock className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-bold">{Math.round(weeklyStats.totalDuration / 60)}h</p>
                  <p className="text-sm text-muted-foreground">Total Time</p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-bold">{weeklyStats.totalDistance.toFixed(1)}km</p>
                  <p className="text-sm text-muted-foreground">Distance</p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Zap className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-bold">{weeklyStats.totalCalories}</p>
                  <p className="text-sm text-muted-foreground">Calories</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Reminders */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {healthReminders
                  .filter((reminder) => reminder.is_active)
                  .slice(0, 3)
                  .map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{reminder.title}</p>
                        <p className="text-sm text-muted-foreground">{reminder.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {reminder.time_of_day} • {reminder.frequency}
                        </p>
                      </div>
                      <Button size="sm" onClick={() => completeReminder(reminder.id)}>
                        Complete
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fitness Tab */}
        <TabsContent value="fitness" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Fitness Activities</h2>
            <Dialog open={isAddingActivity} onOpenChange={setIsAddingActivity}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Log Activity
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log Fitness Activity</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="activity_type">Activity Type</Label>
                    <select
                      id="activity_type"
                      value={newActivity.activity_type}
                      onChange={(e) => setNewActivity({ ...newActivity, activity_type: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="walking">Walking</option>
                      <option value="running">Running</option>
                      <option value="cycling">Cycling</option>
                      <option value="hiking">Hiking</option>
                      <option value="swimming">Swimming</option>
                      <option value="yoga">Yoga</option>
                      <option value="gym">Gym</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={newActivity.duration_minutes}
                        onChange={(e) => setNewActivity({ ...newActivity, duration_minutes: e.target.value })}
                        placeholder="30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="distance">Distance (km)</Label>
                      <Input
                        id="distance"
                        type="number"
                        step="0.1"
                        value={newActivity.distance_km}
                        onChange={(e) => setNewActivity({ ...newActivity, distance_km: e.target.value })}
                        placeholder="5.0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="calories">Calories Burned</Label>
                      <Input
                        id="calories"
                        type="number"
                        value={newActivity.calories_burned}
                        onChange={(e) => setNewActivity({ ...newActivity, calories_burned: e.target.value })}
                        placeholder="200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newActivity.date}
                        onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newActivity.location}
                      onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                      placeholder="Central Park"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={addFitnessActivity} className="flex-1">
                      Log Activity
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingActivity(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {fitnessActivities.map((activity) => (
              <Card key={activity.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getActivityIcon(activity.activity_type)}
                      <div>
                        <p className="font-medium capitalize">{activity.activity_type}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.duration_minutes} min
                          {activity.distance_km && ` • ${activity.distance_km}km`}
                          {activity.calories_burned && ` • ${activity.calories_burned} cal`}
                        </p>
                        {activity.location && <p className="text-xs text-muted-foreground">{activity.location.name}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{new Date(activity.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Reminders Tab */}
        <TabsContent value="reminders" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Health Reminders</h2>
            <Dialog open={isAddingReminder} onOpenChange={setIsAddingReminder}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reminder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Health Reminder</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reminder_type">Type</Label>
                    <select
                      id="reminder_type"
                      value={newReminder.reminder_type}
                      onChange={(e) => setNewReminder({ ...newReminder, reminder_type: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="medication">Medication</option>
                      <option value="hydration">Hydration</option>
                      <option value="exercise">Exercise</option>
                      <option value="sleep">Sleep</option>
                      <option value="vaccination">Vaccination</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newReminder.title}
                      onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                      placeholder="Take medication"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newReminder.description}
                      onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                      placeholder="Additional details..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="frequency">Frequency</Label>
                      <select
                        id="frequency"
                        value={newReminder.frequency}
                        onChange={(e) => setNewReminder({ ...newReminder, frequency: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="once">Once</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newReminder.time_of_day}
                        onChange={(e) => setNewReminder({ ...newReminder, time_of_day: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={addHealthReminder} className="flex-1">
                      Add Reminder
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingReminder(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {healthReminders.map((reminder) => (
              <Card key={reminder.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{reminder.title}</p>
                        <Badge variant={reminder.is_active ? "default" : "secondary"}>
                          {reminder.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{reminder.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {reminder.time_of_day} • {reminder.frequency}
                      </p>
                      {reminder.last_completed && (
                        <p className="text-xs text-green-600">
                          Last completed: {new Date(reminder.last_completed).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <Button size="sm" onClick={() => completeReminder(reminder.id)}>
                      Complete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <h2 className="text-2xl font-bold">Health Profile</h2>

          {healthProfile && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Medical Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Blood Type</Label>
                    <p className="text-sm">{healthProfile.blood_type || "Not specified"}</p>
                  </div>

                  <div>
                    <Label>Medical Conditions</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {healthProfile.medical_conditions.map((condition) => (
                        <Badge key={condition} variant="outline">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Current Medications</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {healthProfile.medications.map((medication) => (
                        <Badge key={medication} variant="secondary">
                          {medication}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Allergies</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {healthProfile.allergies.map((allergy) => (
                        <Badge key={allergy} variant="destructive">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Dietary Restrictions</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {healthProfile.dietary_restrictions.map((restriction) => (
                        <Badge key={restriction} variant="outline">
                          {restriction}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <p className="text-sm">{healthProfile.emergency_contact_name || "Not specified"}</p>
                  </div>

                  <div>
                    <Label>Phone</Label>
                    <p className="text-sm">{healthProfile.emergency_contact_phone || "Not specified"}</p>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
