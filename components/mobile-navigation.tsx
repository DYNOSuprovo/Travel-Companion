"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Home, MapPin, Users, BarChart3, Lightbulb, Award, Cloud, Menu, X, Briefcase, Receipt } from "lucide-react"

interface NavigationProps {
  currentScreen: string
  onNavigate: (screen: string) => void
}

export function MobileNavigation({ currentScreen, onNavigate }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "tracking", label: "Trip Tracking", icon: MapPin },
    { id: "companions", label: "Companions", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "recommendations", label: "Recommendations", icon: Lightbulb },
    { id: "rewards", label: "Rewards", icon: Award },
    { id: "weather", label: "Weather", icon: Cloud },
    { id: "business", label: "Business Travel", icon: Briefcase },
    { id: "expenses", label: "Expense Tracking", icon: Receipt },
  ]

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-primary">Travel Companion</h1>
          <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden">
          <Card className="absolute top-16 left-4 right-4 p-4">
            <div className="grid gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={currentScreen === item.id ? "default" : "ghost"}
                    className="justify-start gap-3"
                    onClick={() => {
                      onNavigate(item.id)
                      setIsMenuOpen(false)
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                )
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        <div className="flex items-center justify-around p-2">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={currentScreen === item.id ? "default" : "ghost"}
                size="sm"
                className="flex-col gap-1 h-auto py-2 px-3"
                onClick={() => onNavigate(item.id)}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{item.label.split(" ")[0]}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </>
  )
}
