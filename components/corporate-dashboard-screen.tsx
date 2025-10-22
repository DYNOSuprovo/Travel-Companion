"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { AlertCircle, Plus, Eye } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  email: string
  department: string
  totalTrips: number
  totalExpenses: number
  complianceScore: number
}

interface CompliancePolicy {
  id: string
  name: string
  maxDailyBudget: number
  requiresApproval: boolean
  violations: number
}

export function CorporateDashboardScreen() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [policies, setPolicies] = useState<CompliancePolicy[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCorporateData()
  }, [])

  const fetchCorporateData = async () => {
    try {
      const [membersRes, policiesRes] = await Promise.all([
        fetch("/api/business/team"),
        fetch("/api/business/policies"),
      ])

      if (membersRes.ok) {
        const data = await membersRes.json()
        setTeamMembers(data.members || [])
      }

      if (policiesRes.ok) {
        const data = await policiesRes.json()
        setPolicies(data.policies || [])
      }
    } catch (error) {
      console.error("Error fetching corporate data:", error)
    } finally {
      setLoading(false)
    }
  }

  const totalTeamExpenses = teamMembers.reduce((sum, m) => sum + m.totalExpenses, 0)
  const totalTeamTrips = teamMembers.reduce((sum, m) => sum + m.totalTrips, 0)
  const avgComplianceScore =
    teamMembers.length > 0
      ? (teamMembers.reduce((sum, m) => sum + m.complianceScore, 0) / teamMembers.length).toFixed(1)
      : 0

  const departmentData = [
    { name: "Sales", trips: 45, expenses: 12500 },
    { name: "Engineering", trips: 28, expenses: 8200 },
    { name: "Marketing", trips: 32, expenses: 9800 },
    { name: "HR", trips: 15, expenses: 4200 },
  ]

  const complianceData = teamMembers.map((m) => ({
    name: m.name.split(" ")[0],
    score: m.complianceScore,
  }))

  return (
    <div className="space-y-6 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Corporate Dashboard</h1>
        <p className="text-muted-foreground">Manage team travel and compliance</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active travelers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalTeamExpenses / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground mt-1">This quarter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeamTrips}</div>
            <p className="text-xs text-muted-foreground mt-1">Recorded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Compliance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgComplianceScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">Team average</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="team" className="space-y-4">
        <TabsList>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Team Members Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Travel Activity</CardTitle>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.department}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium">{member.totalTrips} trips</p>
                        <p className="text-xs text-muted-foreground">${member.totalExpenses.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{member.complianceScore}%</p>
                        <p className="text-xs text-muted-foreground">Compliance</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="expenses" fill="#3b82f6" name="Expenses ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Compliance Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={complianceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#10b981" name="Compliance %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Policies Tab */}
        <TabsContent value="policies">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Travel Policies</CardTitle>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Policy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {policies.map((policy) => (
                  <div key={policy.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{policy.name}</p>
                        <p className="text-sm text-muted-foreground">Max Daily Budget: ${policy.maxDailyBudget}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{policy.violations} violations</p>
                        <p className="text-xs text-muted-foreground">
                          {policy.requiresApproval ? "Requires Approval" : "Auto-approved"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Policy Violations & Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-900">Budget Exceeded</p>
                    <p className="text-sm text-yellow-800">John Smith exceeded daily budget by $250</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border border-red-200 bg-red-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-900">Missing Documentation</p>
                    <p className="text-sm text-red-800">Sarah Johnson missing receipts for 3 expenses</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-900">Approval Pending</p>
                    <p className="text-sm text-blue-800">5 expense reports awaiting manager approval</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
