"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sparkles, Package, Plus, Check, Cloud, Sun, CloudRain } from "lucide-react"

interface PackingItem {
  id: string
  name: string
  category: string
  is_essential: boolean
  is_packed: boolean
  quantity: number
  notes?: string
}

interface PackingList {
  id: string
  destination: string
  travel_dates: { start_date: string; end_date: string }
  weather_forecast: any
  activities: string[]
  items: PackingItem[]
  is_ai_generated: boolean
}

interface WeatherForecast {
  date: string
  temperature: { min: number; max: number }
  condition: string
  precipitation: number
}

export function SmartPackingScreen() {
  const [packingLists, setPackingLists] = useState<PackingList[]>([])
  const [selectedList, setSelectedList] = useState<PackingList | null>(null)
  const [newListData, setNewListData] = useState({
    destination: "",
    start_date: "",
    end_date: "",
    activities: "",
  })
  const [isCreatingList, setIsCreatingList] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    loadPackingLists()
  }, [])

  const loadPackingLists = async () => {
    try {
      const response = await fetch("/api/packing/lists")
      if (response.ok) {
        const data = await response.json()
        setPackingLists(data.lists || [])
      }
    } catch (error) {
      console.error("Load packing lists error:", error)
    }
  }

  const generateSmartPackingList = async () => {
    if (!newListData.destination || !newListData.start_date || !newListData.end_date) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/packing/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: newListData.destination,
          travel_dates: {
            start_date: newListData.start_date,
            end_date: newListData.end_date,
          },
          activities: newListData.activities.split(",").map((a) => a.trim()),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setNewListData({ destination: "", start_date: "", end_date: "", activities: "" })
        setIsCreatingList(false)
        loadPackingLists()
        setSelectedList(data.packing_list)
      }
    } catch (error) {
      console.error("Generate packing list error:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleItemPacked = async (listId: string, itemId: string) => {
    try {
      await fetch(`/api/packing/lists/${listId}/items/${itemId}/toggle`, {
        method: "POST",
      })

      // Update local state
      if (selectedList && selectedList.id === listId) {
        setSelectedList({
          ...selectedList,
          items: selectedList.items.map((item) =>
            item.id === itemId ? { ...item, is_packed: !item.is_packed } : item,
          ),
        })
      }

      setPackingLists(
        packingLists.map((list) =>
          list.id === listId
            ? {
                ...list,
                items: list.items.map((item) => (item.id === itemId ? { ...item, is_packed: !item.is_packed } : item)),
              }
            : list,
        ),
      )
    } catch (error) {
      console.error("Toggle item error:", error)
    }
  }

  const addCustomItem = async (listId: string, itemName: string, category: string) => {
    try {
      const response = await fetch(`/api/packing/lists/${listId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: itemName,
          category,
          is_essential: false,
          quantity: 1,
        }),
      })

      if (response.ok) {
        loadPackingLists()
        if (selectedList && selectedList.id === listId) {
          const updatedList = packingLists.find((list) => list.id === listId)
          if (updatedList) setSelectedList(updatedList)
        }
      }
    } catch (error) {
      console.error("Add item error:", error)
    }
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
      case "clear":
        return <Sun className="h-4 w-4 text-yellow-500" />
      case "cloudy":
      case "overcast":
        return <Cloud className="h-4 w-4 text-gray-500" />
      case "rainy":
      case "rain":
        return <CloudRain className="h-4 w-4 text-blue-500" />
      default:
        return <Cloud className="h-4 w-4 text-gray-500" />
    }
  }

  const getPackingProgress = (list: PackingList) => {
    const packedItems = list.items.filter((item) => item.is_packed).length
    return Math.round((packedItems / list.items.length) * 100)
  }

  const groupItemsByCategory = (items: PackingItem[]) => {
    return items.reduce(
      (groups, item) => {
        const category = item.category
        if (!groups[category]) {
          groups[category] = []
        }
        groups[category].push(item)
        return groups
      },
      {} as Record<string, PackingItem[]>,
    )
  }

  // Mock data for demonstration
  useEffect(() => {
    setPackingLists([
      {
        id: "1",
        destination: "Tokyo, Japan",
        travel_dates: { start_date: "2024-03-15", end_date: "2024-03-22" },
        weather_forecast: [
          { date: "2024-03-15", temperature: { min: 8, max: 18 }, condition: "cloudy", precipitation: 20 },
          { date: "2024-03-16", temperature: { min: 10, max: 20 }, condition: "sunny", precipitation: 0 },
          { date: "2024-03-17", temperature: { min: 12, max: 22 }, condition: "rainy", precipitation: 80 },
        ],
        activities: ["sightseeing", "food tours", "temples", "shopping"],
        items: [
          {
            id: "1",
            name: "Passport",
            category: "documents",
            is_essential: true,
            is_packed: false,
            quantity: 1,
          },
          {
            id: "2",
            name: "Rain jacket",
            category: "clothing",
            is_essential: true,
            is_packed: false,
            quantity: 1,
            notes: "Weather forecast shows rain on March 17th",
          },
          {
            id: "3",
            name: "Comfortable walking shoes",
            category: "footwear",
            is_essential: true,
            is_packed: true,
            quantity: 1,
          },
          {
            id: "4",
            name: "Portable charger",
            category: "electronics",
            is_essential: false,
            is_packed: false,
            quantity: 1,
          },
        ],
        is_ai_generated: true,
      },
    ])
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Smart Packing Lists</h1>
        <Dialog open={isCreatingList} onOpenChange={setIsCreatingList}>
          <DialogTrigger asChild>
            <Button>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate AI List
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Smart Packing List</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  value={newListData.destination}
                  onChange={(e) => setNewListData({ ...newListData, destination: e.target.value })}
                  placeholder="Tokyo, Japan"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={newListData.start_date}
                    onChange={(e) => setNewListData({ ...newListData, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={newListData.end_date}
                    onChange={(e) => setNewListData({ ...newListData, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="activities">Planned Activities</Label>
                <Input
                  id="activities"
                  value={newListData.activities}
                  onChange={(e) => setNewListData({ ...newListData, activities: e.target.value })}
                  placeholder="sightseeing, food tours, hiking (comma separated)"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={generateSmartPackingList} disabled={isGenerating} className="flex-1">
                  {isGenerating ? "Generating..." : "Generate List"}
                </Button>
                <Button variant="outline" onClick={() => setIsCreatingList(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Packing Lists Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packingLists.map((list) => (
          <Card key={list.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader onClick={() => setSelectedList(list)}>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{list.destination}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(list.travel_dates.start_date).toLocaleDateString()} -{" "}
                    {new Date(list.travel_dates.end_date).toLocaleDateString()}
                  </p>
                </div>
                {list.is_ai_generated && (
                  <Badge variant="secondary">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Packing Progress</span>
                    <span>{getPackingProgress(list)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${getPackingProgress(list)}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {list.activities.slice(0, 3).map((activity) => (
                    <Badge key={activity} variant="outline" className="text-xs">
                      {activity}
                    </Badge>
                  ))}
                  {list.activities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{list.activities.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Packing List */}
      {selectedList && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {selectedList.destination}
                </CardTitle>
                <p className="text-muted-foreground">
                  {new Date(selectedList.travel_dates.start_date).toLocaleDateString()} -{" "}
                  {new Date(selectedList.travel_dates.end_date).toLocaleDateString()}
                </p>
              </div>
              <Button variant="outline" onClick={() => setSelectedList(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Weather Forecast */}
            {selectedList.weather_forecast && (
              <div>
                <h3 className="font-medium mb-3">Weather Forecast</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectedList.weather_forecast.map((day: WeatherForecast) => (
                    <div key={day.date} className="flex items-center gap-3 p-3 border rounded-lg">
                      {getWeatherIcon(day.condition)}
                      <div>
                        <p className="font-medium">{new Date(day.date).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {day.temperature.min}°-{day.temperature.max}°C
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">{day.condition}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Packing Items by Category */}
            <div>
              <h3 className="font-medium mb-3">Packing Items</h3>
              <div className="space-y-4">
                {Object.entries(groupItemsByCategory(selectedList.items)).map(([category, items]) => (
                  <div key={category} className="border rounded-lg p-4">
                    <h4 className="font-medium capitalize mb-3">{category}</h4>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <Checkbox
                            checked={item.is_packed}
                            onCheckedChange={() => toggleItemPacked(selectedList.id, item.id)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={item.is_packed ? "line-through text-muted-foreground" : ""}>
                                {item.name}
                              </span>
                              {item.is_essential && (
                                <Badge variant="destructive" className="text-xs">
                                  Essential
                                </Badge>
                              )}
                              {item.quantity > 1 && (
                                <Badge variant="secondary" className="text-xs">
                                  x{item.quantity}
                                </Badge>
                              )}
                            </div>
                            {item.notes && <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>}
                          </div>
                          {item.is_packed && <Check className="h-4 w-4 text-green-500" />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Custom Item */}
            <div className="border-t pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  const itemName = prompt("Item name:")
                  const category = prompt("Category:")
                  if (itemName && category) {
                    addCustomItem(selectedList.id, itemName, category)
                  }
                }}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Item
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
