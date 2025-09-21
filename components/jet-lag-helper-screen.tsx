"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Clock, Sun, Moon, Utensils, Lightbulb, Plane, Calendar } from "lucide-react"

interface JetLagPlan {
  id: string
  origin_timezone: string
  destination_timezone: string
  departure_time: string
  arrival_time: string
  time_difference_hours: number
  adjustment_plan: DailyAdjustment[]
  sleep_schedule: SleepRecommendation[]
  light_exposure_plan: LightExposure[]
  meal_timing: MealTiming[]
}

interface DailyAdjustment {
  day: number
  date: string
  sleep_time: string
  wake_time: string
  light_exposure: string[]
  meal_times: string[]
  activities: string[]
}

interface SleepRecommendation {
  day: number
  bedtime: string
  wake_time: string
  duration_hours: number
  notes: string
}

interface LightExposure {
  day: number
  morning_light: string
  avoid_light_after: string
  light_therapy: boolean
  notes: string
}

interface MealTiming {
  day: number
  breakfast: string
  lunch: string
  dinner: string
  notes: string
}

export function JetLagHelperScreen() {
  const [jetLagPlans, setJetLagPlans] = useState<JetLagPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<JetLagPlan | null>(null)
  const [isCreatingPlan, setIsCreatingPlan] = useState(false)
  const [newPlan, setNewPlan] = useState({
    origin_timezone: "",
    destination_timezone: "",
    departure_time: "",
    arrival_time: "",
  })

  useEffect(() => {
    loadJetLagPlans()
  }, [])

  const loadJetLagPlans = async () => {
    // Mock data for demonstration
    setJetLagPlans([
      {
        id: "1",
        origin_timezone: "America/New_York",
        destination_timezone: "Asia/Tokyo",
        departure_time: "2024-03-15T14:00:00Z",
        arrival_time: "2024-03-16T18:00:00+09:00",
        time_difference_hours: 14,
        adjustment_plan: [
          {
            day: 1,
            date: "2024-03-16",
            sleep_time: "22:00",
            wake_time: "06:00",
            light_exposure: ["Morning sunlight 06:00-08:00", "Avoid screens after 20:00"],
            meal_times: ["07:00", "12:00", "19:00"],
            activities: ["Light exercise in morning", "Stay hydrated"],
          },
          {
            day: 2,
            date: "2024-03-17",
            sleep_time: "22:30",
            wake_time: "06:30",
            light_exposure: ["Morning sunlight 06:30-08:30", "Avoid screens after 20:30"],
            meal_times: ["07:30", "12:30", "19:30"],
            activities: ["Moderate exercise", "Local meal times"],
          },
        ],
        sleep_schedule: [
          {
            day: 1,
            bedtime: "22:00",
            wake_time: "06:00",
            duration_hours: 8,
            notes: "Try to sleep on local time immediately",
          },
          {
            day: 2,
            bedtime: "22:30",
            wake_time: "06:30",
            duration_hours: 8,
            notes: "Gradually adjust to preferred schedule",
          },
        ],
        light_exposure_plan: [
          {
            day: 1,
            morning_light: "06:00-08:00",
            avoid_light_after: "20:00",
            light_therapy: true,
            notes: "Use bright light therapy lamp if natural light unavailable",
          },
          {
            day: 2,
            morning_light: "06:30-08:30",
            avoid_light_after: "20:30",
            light_therapy: false,
            notes: "Natural sunlight preferred",
          },
        ],
        meal_timing: [
          {
            day: 1,
            breakfast: "07:00",
            lunch: "12:00",
            dinner: "19:00",
            notes: "Eat according to local time to help reset circadian rhythm",
          },
          {
            day: 2,
            breakfast: "07:30",
            lunch: "12:30",
            dinner: "19:30",
            notes: "Continue with local meal schedule",
          },
        ],
      },
    ])
  }

  const generateJetLagPlan = async () => {
    if (!newPlan.origin_timezone || !newPlan.destination_timezone || !newPlan.departure_time || !newPlan.arrival_time)
      return

    try {
      const response = await fetch("/api/health/jet-lag/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlan),
      })

      if (response.ok) {
        const data = await response.json()
        setNewPlan({
          origin_timezone: "",
          destination_timezone: "",
          departure_time: "",
          arrival_time: "",
        })
        setIsCreatingPlan(false)
        loadJetLagPlans()
        setSelectedPlan(data.jet_lag_plan)
      }
    } catch (error) {
      console.error("Generate jet lag plan error:", error)
    }
  }

  const getAdjustmentProgress = (plan: JetLagPlan) => {
    // Calculate how many days into the adjustment we are
    const today = new Date()
    const arrivalDate = new Date(plan.arrival_time)
    const daysSinceArrival = Math.floor((today.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysSinceArrival < 0) return 0
    if (daysSinceArrival >= plan.adjustment_plan.length) return 100

    return Math.round((daysSinceArrival / plan.adjustment_plan.length) * 100)
  }

  const getCurrentDayPlan = (plan: JetLagPlan) => {
    const today = new Date()
    const arrivalDate = new Date(plan.arrival_time)
    const daysSinceArrival = Math.floor((today.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysSinceArrival < 0 || daysSinceArrival >= plan.adjustment_plan.length) return null

    return plan.adjustment_plan[daysSinceArrival]
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Jet Lag Helper</h1>
        <Dialog open={isCreatingPlan} onOpenChange={setIsCreatingPlan}>
          <DialogTrigger asChild>
            <Button>
              <Plane className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Jet Lag Adjustment Plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="origin">Origin Timezone</Label>
                  <select
                    id="origin"
                    value={newPlan.origin_timezone}
                    onChange={(e) => setNewPlan({ ...newPlan, origin_timezone: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select timezone</option>
                    <option value="America/New_York">Eastern Time (US)</option>
                    <option value="America/Los_Angeles">Pacific Time (US)</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                    <option value="Asia/Shanghai">Shanghai</option>
                    <option value="Australia/Sydney">Sydney</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="destination">Destination Timezone</Label>
                  <select
                    id="destination"
                    value={newPlan.destination_timezone}
                    onChange={(e) => setNewPlan({ ...newPlan, destination_timezone: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select timezone</option>
                    <option value="America/New_York">Eastern Time (US)</option>
                    <option value="America/Los_Angeles">Pacific Time (US)</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                    <option value="Asia/Shanghai">Shanghai</option>
                    <option value="Australia/Sydney">Sydney</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departure">Departure Time</Label>
                  <Input
                    id="departure"
                    type="datetime-local"
                    value={newPlan.departure_time}
                    onChange={(e) => setNewPlan({ ...newPlan, departure_time: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="arrival">Arrival Time</Label>
                  <Input
                    id="arrival"
                    type="datetime-local"
                    value={newPlan.arrival_time}
                    onChange={(e) => setNewPlan({ ...newPlan, arrival_time: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={generateJetLagPlan} className="flex-1">
                  Generate Plan
                </Button>
                <Button variant="outline" onClick={() => setIsCreatingPlan(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Jet Lag Plans Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jetLagPlans.map((plan) => (
          <Card key={plan.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader onClick={() => setSelectedPlan(plan)}>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {plan.origin_timezone.split("/")[1]} → {plan.destination_timezone.split("/")[1]}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {Math.abs(plan.time_difference_hours)} hour time difference
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Adjustment Progress</span>
                    <span>{getAdjustmentProgress(plan)}%</span>
                  </div>
                  <Progress value={getAdjustmentProgress(plan)} className="h-2" />
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Departure: {new Date(plan.departure_time).toLocaleString()}</p>
                  <p>Arrival: {new Date(plan.arrival_time).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Jet Lag Plan */}
      {selectedPlan && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5" />
                  Jet Lag Adjustment Plan
                </CardTitle>
                <p className="text-muted-foreground">
                  {selectedPlan.origin_timezone.split("/")[1]} → {selectedPlan.destination_timezone.split("/")[1]} (
                  {selectedPlan.time_difference_hours > 0 ? "+" : ""}
                  {selectedPlan.time_difference_hours} hours)
                </p>
              </div>
              <Button variant="outline" onClick={() => setSelectedPlan(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Day Recommendations */}
            {getCurrentDayPlan(selectedPlan) && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Today's Plan - Day {getCurrentDayPlan(selectedPlan)!.day}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Moon className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Sleep Schedule</p>
                        <p className="text-sm text-muted-foreground">
                          {getCurrentDayPlan(selectedPlan)!.sleep_time} - {getCurrentDayPlan(selectedPlan)!.wake_time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Utensils className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Meal Times</p>
                        <p className="text-sm text-muted-foreground">
                          {getCurrentDayPlan(selectedPlan)!.meal_times.join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">Light Exposure</p>
                    <div className="space-y-1">
                      {getCurrentDayPlan(selectedPlan)!.light_exposure.map((exposure, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Sun className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">{exposure}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">Activities</p>
                    <div className="flex flex-wrap gap-2">
                      {getCurrentDayPlan(selectedPlan)!.activities.map((activity, index) => (
                        <Badge key={index} variant="outline">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Full Adjustment Schedule */}
            <div>
              <h3 className="font-medium mb-4">Complete Adjustment Schedule</h3>
              <div className="space-y-4">
                {selectedPlan.adjustment_plan.map((day) => (
                  <Card key={day.day} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium">Day {day.day}</h4>
                        <span className="text-sm text-muted-foreground">{day.date}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <Moon className="h-3 w-3" />
                            Sleep
                          </p>
                          <p className="text-muted-foreground">
                            {day.sleep_time} - {day.wake_time}
                          </p>
                        </div>

                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <Utensils className="h-3 w-3" />
                            Meals
                          </p>
                          <p className="text-muted-foreground">{day.meal_times.join(", ")}</p>
                        </div>

                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <Lightbulb className="h-3 w-3" />
                            Light
                          </p>
                          <p className="text-muted-foreground">{day.light_exposure[0]}</p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {day.activities.map((activity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {activity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
