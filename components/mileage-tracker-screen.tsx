"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { MapPin, Download } from "lucide-react"

interface MileageRecord {
  id: string
  date: string
  origin: string
  destination: string
  miles: number
  purpose: string
  rate: number
  deduction: number
}

export function MileageTrackerScreen() {
  const [mileageRecords, setMileageRecords] = useState<MileageRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    origin: "",
    destination: "",
    miles: 0,
    purpose: "Business",
  })
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  useEffect(() => {
    fetchMileageData()
  }, [])

  const fetchMileageData = async () => {
    try {
      const response = await fetch("/api/business/mileage")
      const data = await response.json()
      setMileageRecords(data.records || [])
    } catch (error) {
      console.error("Error fetching mileage data:", error)
    } finally {
      setLoading(false)
    }
  }

  const addMileageRecord = async () => {
    if (!newRecord.origin || !newRecord.destination || newRecord.miles <= 0) {
      alert("Please fill in all fields")
      return
    }

    try {
      const response = await fetch("/api/business/mileage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newRecord,
          date: new Date().toISOString(),
          rate: 0.67, // 2024 IRS standard mileage rate
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setMileageRecords([...mileageRecords, data.record])
        setNewRecord({ origin: "", destination: "", miles: 0, purpose: "Business" })
      }
    } catch (error) {
      console.error("Error adding mileage record:", error)
    }
  }

  const totalMiles = mileageRecords.reduce((sum, r) => sum + r.miles, 0)
  const totalDeduction = mileageRecords.reduce((sum, r) => sum + r.deduction, 0)
  const averageMilesPerTrip = mileageRecords.length > 0 ? (totalMiles / mileageRecords.length).toFixed(1) : 0

  const chartData = mileageRecords.slice(-7).map((r) => ({
    date: new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    miles: r.miles,
    deduction: r.deduction,
  }))

  const purposeBreakdown = [
    {
      name: "Business",
      value: mileageRecords.filter((r) => r.purpose === "Business").reduce((sum, r) => sum + r.miles, 0),
    },
    {
      name: "Medical",
      value: mileageRecords.filter((r) => r.purpose === "Medical").reduce((sum, r) => sum + r.miles, 0),
    },
    {
      name: "Charity",
      value: mileageRecords.filter((r) => r.purpose === "Charity").reduce((sum, r) => sum + r.miles, 0),
    },
  ].filter((item) => item.value > 0)

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"]

  return (
    <div className="space-y-6 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Mileage Tracker</h1>
        <p className="text-muted-foreground">Track business miles for tax deductions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Miles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMiles.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">This year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tax Deduction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDeduction.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">@ $0.67/mile</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg per Trip</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageMilesPerTrip}</div>
            <p className="text-xs text-muted-foreground mt-1">miles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mileageRecords.length}</div>
            <p className="text-xs text-muted-foreground mt-1">recorded</p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Record */}
      <Card>
        <CardHeader>
          <CardTitle>Log New Trip</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Origin</label>
              <Input
                placeholder="Starting location"
                value={newRecord.origin}
                onChange={(e) => setNewRecord({ ...newRecord, origin: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Destination</label>
              <Input
                placeholder="Ending location"
                value={newRecord.destination}
                onChange={(e) => setNewRecord({ ...newRecord, destination: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Miles</label>
              <Input
                type="number"
                placeholder="0"
                value={newRecord.miles}
                onChange={(e) => setNewRecord({ ...newRecord, miles: Number.parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Purpose</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={newRecord.purpose}
                onChange={(e) => setNewRecord({ ...newRecord, purpose: e.target.value })}
              >
                <option>Business</option>
                <option>Medical</option>
                <option>Charity</option>
              </select>
            </div>
          </div>
          <Button onClick={addMileageRecord} className="w-full">
            <MapPin className="w-4 h-4 mr-2" />
            Log Trip
          </Button>
        </CardContent>
      </Card>

      {/* Charts */}
      <Tabs defaultValue="trend" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trend">Trend</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle>Mileage Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="miles" stroke="#3b82f6" name="Miles" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown">
          <Card>
            <CardHeader>
              <CardTitle>Purpose Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {purposeBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={purposeBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value} mi`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {purposeBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-8">No data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Trip History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {mileageRecords.length > 0 ? (
                  mileageRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">
                          {record.origin} → {record.destination}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(record.date).toLocaleDateString()} • {record.purpose}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{record.miles} mi</p>
                        <p className="text-sm text-green-600">${record.deduction.toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No trips logged yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Button */}
      <Button variant="outline" className="w-full bg-transparent">
        <Download className="w-4 h-4 mr-2" />
        Export for Tax Filing
      </Button>
    </div>
  )
}
