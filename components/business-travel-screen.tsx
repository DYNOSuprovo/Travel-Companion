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
import { Briefcase, FileText, DollarSign, Car, CheckCircle, Clock, AlertCircle, Plus } from "lucide-react"

interface BusinessTrip {
  id: string
  purpose: string
  client_company?: string
  project_code?: string
  cost_center?: string
  approval_status: "pending" | "approved" | "rejected"
  approved_by?: string
  budget_allocated: number
  budget_currency: string
  is_billable: boolean
  created_at: string
}

interface ExpenseReport {
  id: string
  report_name: string
  report_period_start: string
  report_period_end: string
  total_amount: number
  currency: string
  status: "draft" | "submitted" | "approved" | "rejected" | "paid"
  submitted_at?: string
  approved_at?: string
  line_items_count: number
}

interface MileageEntry {
  id: string
  date: string
  start_location: string
  end_location: string
  distance_miles: number
  purpose: string
  total_reimbursement: number
}

interface BusinessProfile {
  id: string
  company_name?: string
  employee_id?: string
  department?: string
  manager_email?: string
  preferred_airlines: string[]
  preferred_hotels: string[]
  expense_approval_required: boolean
}

export function BusinessTravelScreen() {
  const [businessTrips, setBusinessTrips] = useState<BusinessTrip[]>([])
  const [expenseReports, setExpenseReports] = useState<ExpenseReport[]>([])
  const [mileageEntries, setMileageEntries] = useState<MileageEntry[]>([])
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isCreatingTrip, setIsCreatingTrip] = useState(false)
  const [isCreatingReport, setIsCreatingReport] = useState(false)
  const [isAddingMileage, setIsAddingMileage] = useState(false)

  const [newTrip, setNewTrip] = useState({
    purpose: "meeting",
    client_company: "",
    project_code: "",
    cost_center: "",
    budget_allocated: "",
    is_billable: false,
  })

  const [newReport, setNewReport] = useState({
    report_name: "",
    report_period_start: "",
    report_period_end: "",
  })

  const [newMileage, setNewMileage] = useState({
    date: new Date().toISOString().split("T")[0],
    start_location: "",
    end_location: "",
    distance_miles: "",
    purpose: "",
  })

  useEffect(() => {
    loadBusinessData()
  }, [])

  const loadBusinessData = async () => {
    // Mock data for demonstration
    setBusinessProfile({
      id: "1",
      company_name: "Tech Corp Inc.",
      employee_id: "EMP001",
      department: "Engineering",
      manager_email: "manager@techcorp.com",
      preferred_airlines: ["Delta", "United"],
      preferred_hotels: ["Marriott", "Hilton"],
      expense_approval_required: true,
    })

    setBusinessTrips([
      {
        id: "1",
        purpose: "client_visit",
        client_company: "ABC Corp",
        project_code: "PROJ-2024-001",
        cost_center: "ENG-001",
        approval_status: "approved",
        approved_by: "manager@techcorp.com",
        budget_allocated: 2500.0,
        budget_currency: "USD",
        is_billable: true,
        created_at: "2024-01-10T10:00:00Z",
      },
      {
        id: "2",
        purpose: "conference",
        project_code: "CONF-2024-002",
        cost_center: "ENG-001",
        approval_status: "pending",
        budget_allocated: 1800.0,
        budget_currency: "USD",
        is_billable: false,
        created_at: "2024-01-12T14:30:00Z",
      },
    ])

    setExpenseReports([
      {
        id: "1",
        report_name: "Q1 2024 Business Travel",
        report_period_start: "2024-01-01",
        report_period_end: "2024-03-31",
        total_amount: 1245.67,
        currency: "USD",
        status: "submitted",
        submitted_at: "2024-01-15T09:00:00Z",
        line_items_count: 8,
      },
      {
        id: "2",
        report_name: "Client Visit - ABC Corp",
        report_period_start: "2024-01-10",
        report_period_end: "2024-01-12",
        total_amount: 567.89,
        currency: "USD",
        status: "draft",
        line_items_count: 5,
      },
    ])

    setMileageEntries([
      {
        id: "1",
        date: "2024-01-15",
        start_location: "Office",
        end_location: "Client Site",
        distance_miles: 45.2,
        purpose: "Client meeting",
        total_reimbursement: 29.38,
      },
      {
        id: "2",
        date: "2024-01-14",
        start_location: "Hotel",
        end_location: "Conference Center",
        distance_miles: 12.5,
        purpose: "Conference attendance",
        total_reimbursement: 8.13,
      },
    ])
  }

  const createBusinessTrip = async () => {
    if (!newTrip.purpose) return

    try {
      const response = await fetch("/api/business/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTrip,
          budget_allocated: Number.parseFloat(newTrip.budget_allocated),
        }),
      })

      if (response.ok) {
        setNewTrip({
          purpose: "meeting",
          client_company: "",
          project_code: "",
          cost_center: "",
          budget_allocated: "",
          is_billable: false,
        })
        setIsCreatingTrip(false)
        loadBusinessData()
      }
    } catch (error) {
      console.error("Create business trip error:", error)
    }
  }

  const createExpenseReport = async () => {
    if (!newReport.report_name || !newReport.report_period_start || !newReport.report_period_end) return

    try {
      const response = await fetch("/api/business/expense-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReport),
      })

      if (response.ok) {
        setNewReport({
          report_name: "",
          report_period_start: "",
          report_period_end: "",
        })
        setIsCreatingReport(false)
        loadBusinessData()
      }
    } catch (error) {
      console.error("Create expense report error:", error)
    }
  }

  const addMileageEntry = async () => {
    if (!newMileage.start_location || !newMileage.end_location || !newMileage.distance_miles) return

    try {
      const response = await fetch("/api/business/mileage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newMileage,
          distance_miles: Number.parseFloat(newMileage.distance_miles),
        }),
      })

      if (response.ok) {
        setNewMileage({
          date: new Date().toISOString().split("T")[0],
          start_location: "",
          end_location: "",
          distance_miles: "",
          purpose: "",
        })
        setIsAddingMileage(false)
        loadBusinessData()
      }
    } catch (error) {
      console.error("Add mileage entry error:", error)
    }
  }

  const submitExpenseReport = async (reportId: string) => {
    try {
      await fetch(`/api/business/expense-reports/${reportId}/submit`, {
        method: "POST",
      })
      loadBusinessData()
    } catch (error) {
      console.error("Submit expense report error:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
      case "submitted":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "paid":
        return "default"
      case "pending":
      case "submitted":
        return "secondary"
      case "rejected":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getTotalPendingExpenses = () => {
    return expenseReports
      .filter((report) => report.status === "submitted" || report.status === "draft")
      .reduce((sum, report) => sum + report.total_amount, 0)
  }

  const getTotalMileageReimbursement = () => {
    return mileageEntries.reduce((sum, entry) => sum + entry.total_reimbursement, 0)
  }

  return (
    <div className="p-6 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trips">Business Trips</TabsTrigger>
          <TabsTrigger value="expenses">Expense Reports</TabsTrigger>
          <TabsTrigger value="mileage">Mileage</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Trips</p>
                    <p className="text-2xl font-bold">{businessTrips.length}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Expenses</p>
                    <p className="text-2xl font-bold">${getTotalPendingExpenses().toFixed(2)}</p>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Mileage Reimbursement</p>
                    <p className="text-2xl font-bold">${getTotalMileageReimbursement().toFixed(2)}</p>
                  </div>
                  <Car className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Approved Budget</p>
                    <p className="text-2xl font-bold">
                      $
                      {businessTrips
                        .filter((trip) => trip.approval_status === "approved")
                        .reduce((sum, trip) => sum + trip.budget_allocated, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Business Profile */}
          {businessProfile && (
            <Card>
              <CardHeader>
                <CardTitle>Business Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Company</Label>
                    <p className="text-sm">{businessProfile.company_name}</p>
                  </div>
                  <div>
                    <Label>Employee ID</Label>
                    <p className="text-sm">{businessProfile.employee_id}</p>
                  </div>
                  <div>
                    <Label>Department</Label>
                    <p className="text-sm">{businessProfile.department}</p>
                  </div>
                  <div>
                    <Label>Manager</Label>
                    <p className="text-sm">{businessProfile.manager_email}</p>
                  </div>
                </div>

                <div>
                  <Label>Preferred Airlines</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {businessProfile.preferred_airlines.map((airline) => (
                      <Badge key={airline} variant="outline">
                        {airline}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Preferred Hotels</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {businessProfile.preferred_hotels.map((hotel) => (
                      <Badge key={hotel} variant="outline">
                        {hotel}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Business Trips Tab */}
        <TabsContent value="trips" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Business Trips</h2>
            <Dialog open={isCreatingTrip} onOpenChange={setIsCreatingTrip}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Business Trip
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Business Trip</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="purpose">Purpose</Label>
                    <select
                      id="purpose"
                      value={newTrip.purpose}
                      onChange={(e) => setNewTrip({ ...newTrip, purpose: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="meeting">Meeting</option>
                      <option value="conference">Conference</option>
                      <option value="training">Training</option>
                      <option value="client_visit">Client Visit</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="client_company">Client Company (Optional)</Label>
                    <Input
                      id="client_company"
                      value={newTrip.client_company}
                      onChange={(e) => setNewTrip({ ...newTrip, client_company: e.target.value })}
                      placeholder="ABC Corp"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="project_code">Project Code</Label>
                      <Input
                        id="project_code"
                        value={newTrip.project_code}
                        onChange={(e) => setNewTrip({ ...newTrip, project_code: e.target.value })}
                        placeholder="PROJ-2024-001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cost_center">Cost Center</Label>
                      <Input
                        id="cost_center"
                        value={newTrip.cost_center}
                        onChange={(e) => setNewTrip({ ...newTrip, cost_center: e.target.value })}
                        placeholder="ENG-001"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="budget">Budget Allocated ($)</Label>
                    <Input
                      id="budget"
                      type="number"
                      step="0.01"
                      value={newTrip.budget_allocated}
                      onChange={(e) => setNewTrip({ ...newTrip, budget_allocated: e.target.value })}
                      placeholder="2500.00"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="billable"
                      checked={newTrip.is_billable}
                      onChange={(e) => setNewTrip({ ...newTrip, is_billable: e.target.checked })}
                    />
                    <Label htmlFor="billable">Billable to client</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={createBusinessTrip} className="flex-1">
                      Create Trip
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreatingTrip(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {businessTrips.map((trip) => (
              <Card key={trip.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium capitalize">{trip.purpose.replace("_", " ")}</h3>
                        {trip.is_billable && (
                          <Badge variant="secondary" className="text-xs">
                            Billable
                          </Badge>
                        )}
                      </div>

                      {trip.client_company && (
                        <p className="text-sm text-muted-foreground">Client: {trip.client_company}</p>
                      )}

                      <div className="flex gap-4 text-sm text-muted-foreground">
                        {trip.project_code && <span>Project: {trip.project_code}</span>}
                        {trip.cost_center && <span>Cost Center: {trip.cost_center}</span>}
                      </div>

                      <p className="text-sm">
                        Budget: ${trip.budget_allocated.toFixed(2)} {trip.budget_currency}
                      </p>
                    </div>

                    <div className="text-right space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(trip.approval_status)}
                        <Badge variant={getStatusColor(trip.approval_status) as any}>{trip.approval_status}</Badge>
                      </div>

                      {trip.approved_by && (
                        <p className="text-xs text-muted-foreground">Approved by: {trip.approved_by}</p>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(trip.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Expense Reports Tab */}
        <TabsContent value="expenses" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Expense Reports</h2>
            <Dialog open={isCreatingReport} onOpenChange={setIsCreatingReport}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Expense Report
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Expense Report</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="report_name">Report Name</Label>
                    <Input
                      id="report_name"
                      value={newReport.report_name}
                      onChange={(e) => setNewReport({ ...newReport, report_name: e.target.value })}
                      placeholder="Q1 2024 Business Travel"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start_date">Period Start</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={newReport.report_period_start}
                        onChange={(e) => setNewReport({ ...newReport, report_period_start: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end_date">Period End</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={newReport.report_period_end}
                        onChange={(e) => setNewReport({ ...newReport, report_period_end: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={createExpenseReport} className="flex-1">
                      Create Report
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreatingReport(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {expenseReports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <h3 className="font-medium">{report.report_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(report.report_period_start).toLocaleDateString()} -{" "}
                        {new Date(report.report_period_end).toLocaleDateString()}
                      </p>
                      <p className="text-sm">
                        ${report.total_amount.toFixed(2)} {report.currency} • {report.line_items_count} items
                      </p>
                      {report.submitted_at && (
                        <p className="text-xs text-muted-foreground">
                          Submitted: {new Date(report.submitted_at).toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="text-right space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(report.status)}
                        <Badge variant={getStatusColor(report.status) as any}>{report.status}</Badge>
                      </div>

                      <div className="flex gap-2">
                        {report.status === "draft" && (
                          <Button size="sm" onClick={() => submitExpenseReport(report.id)}>
                            Submit
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Mileage Tab */}
        <TabsContent value="mileage" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Mileage Tracking</h2>
            <Dialog open={isAddingMileage} onOpenChange={setIsAddingMileage}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Mileage
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Mileage Entry</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mileage_date">Date</Label>
                    <Input
                      id="mileage_date"
                      type="date"
                      value={newMileage.date}
                      onChange={(e) => setNewMileage({ ...newMileage, date: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start_location">Start Location</Label>
                      <Input
                        id="start_location"
                        value={newMileage.start_location}
                        onChange={(e) => setNewMileage({ ...newMileage, start_location: e.target.value })}
                        placeholder="Office"
                      />
                    </div>
                    <div>
                      <Label htmlFor="end_location">End Location</Label>
                      <Input
                        id="end_location"
                        value={newMileage.end_location}
                        onChange={(e) => setNewMileage({ ...newMileage, end_location: e.target.value })}
                        placeholder="Client Site"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="distance">Distance (miles)</Label>
                    <Input
                      id="distance"
                      type="number"
                      step="0.1"
                      value={newMileage.distance_miles}
                      onChange={(e) => setNewMileage({ ...newMileage, distance_miles: e.target.value })}
                      placeholder="25.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mileage_purpose">Purpose</Label>
                    <Textarea
                      id="mileage_purpose"
                      value={newMileage.purpose}
                      onChange={(e) => setNewMileage({ ...newMileage, purpose: e.target.value })}
                      placeholder="Client meeting"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={addMileageEntry} className="flex-1">
                      Add Entry
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingMileage(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Mileage Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Mileage Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {mileageEntries.reduce((sum, entry) => sum + entry.distance_miles, 0).toFixed(1)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Miles</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">${getTotalMileageReimbursement().toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Total Reimbursement</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">$0.65</p>
                  <p className="text-sm text-muted-foreground">Rate per Mile</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mileage Entries */}
          <div className="space-y-4">
            {mileageEntries.map((entry) => (
              <Card key={entry.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        <span className="font-medium">
                          {entry.start_location} → {entry.end_location}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{entry.purpose}</p>
                      <p className="text-sm text-muted-foreground">
                        {entry.distance_miles} miles • {new Date(entry.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${entry.total_reimbursement.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Reimbursement</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
