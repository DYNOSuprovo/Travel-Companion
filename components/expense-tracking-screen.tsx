"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Receipt, Camera, DollarSign, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"

interface Expense {
  id: string
  category: string
  amount: number
  currency: string
  description: string
  date: string
  receipt_url?: string
}

interface Budget {
  id: string
  category: string
  budget_amount: number
  spent_amount: number
  currency: string
}

export function ExpenseTrackingScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  })
  const [isAddingExpense, setIsAddingExpense] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    loadExpenseData()
  }, [])

  const loadExpenseData = async () => {
    // Load expenses and budgets from API
    setExpenses([
      {
        id: "1",
        category: "food",
        amount: 45.5,
        currency: "USD",
        description: "Dinner at local restaurant",
        date: "2024-01-15",
      },
      {
        id: "2",
        category: "transport",
        amount: 25.0,
        currency: "USD",
        description: "Taxi to airport",
        date: "2024-01-14",
      },
    ])

    setBudgets([
      {
        id: "1",
        category: "food",
        budget_amount: 500,
        spent_amount: 245.5,
        currency: "USD",
      },
      {
        id: "2",
        category: "transport",
        budget_amount: 300,
        spent_amount: 125.0,
        currency: "USD",
      },
    ])
  }

  const addExpense = async () => {
    if (!newExpense.category || !newExpense.amount) return

    try {
      const formData = new FormData()
      formData.append("category", newExpense.category)
      formData.append("amount", newExpense.amount)
      formData.append("description", newExpense.description)
      formData.append("date", newExpense.date)
      if (selectedFile) {
        formData.append("receipt", selectedFile)
      }

      const response = await fetch("/api/expenses", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        setNewExpense({
          category: "",
          amount: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
        })
        setSelectedFile(null)
        setIsAddingExpense(false)
        loadExpenseData()
      }
    } catch (error) {
      console.error("Add expense error:", error)
    }
  }

  const scanReceipt = async (file: File) => {
    // OCR receipt scanning
    const formData = new FormData()
    formData.append("receipt", file)

    try {
      const response = await fetch("/api/expenses/scan-receipt", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setNewExpense({
          ...newExpense,
          amount: data.amount?.toString() || "",
          description: data.description || "",
        })
      }
    } catch (error) {
      console.error("Receipt scan error:", error)
    }
  }

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.budget_amount, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">${totalBudget.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold">${(totalBudget - totalSpent).toFixed(2)}</p>
              </div>
              {totalSpent > totalBudget ? (
                <TrendingDown className="h-8 w-8 text-red-500" />
              ) : (
                <TrendingUp className="h-8 w-8 text-green-500" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {budgets.map((budget) => {
            const percentage = (budget.spent_amount / budget.budget_amount) * 100
            const isOverBudget = percentage > 100

            return (
              <div key={budget.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="capitalize font-medium">{budget.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      ${budget.spent_amount.toFixed(2)} / ${budget.budget_amount.toFixed(2)}
                    </span>
                    {isOverBudget && <AlertCircle className="h-4 w-4 text-red-500" />}
                  </div>
                </div>
                <Progress value={Math.min(percentage, 100)} className={`h-2 ${isOverBudget ? "bg-red-100" : ""}`} />
                {isOverBudget && (
                  <p className="text-sm text-red-500">
                    Over budget by ${(budget.spent_amount - budget.budget_amount).toFixed(2)}
                  </p>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Expenses</CardTitle>
          <Dialog open={isAddingExpense} onOpenChange={setIsAddingExpense}>
            <DialogTrigger asChild>
              <Button>Add Expense</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newExpense.category}
                    onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="accommodation">Accommodation</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="activities">Activities</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    placeholder="What did you spend on?"
                  />
                </div>

                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="receipt">Receipt (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="receipt"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setSelectedFile(file)
                          scanReceipt(file)
                        }
                      }}
                    />
                    <Button type="button" variant="outline" size="icon">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={addExpense} className="flex-1">
                    Add Expense
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingExpense(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Receipt className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {expense.date} • <span className="capitalize">{expense.category}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${expense.amount.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">{expense.currency}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
