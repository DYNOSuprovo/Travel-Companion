"use client"

import { useState } from "react"
import { MobileNavigation } from "@/components/mobile-navigation"
import { DashboardScreen } from "@/components/dashboard-screen"
import { TripTrackingScreen } from "@/components/trip-tracking-screen"
import { CompanionManagementScreen } from "@/components/companion-management-screen"
import { AnalyticsScreen } from "@/components/analytics-screen"
import { RecommendationsScreen } from "@/components/recommendations-screen"
import { RewardsScreen } from "@/components/rewards-screen"
import { WeatherScreen } from "@/components/weather-screen"

export function AppContainer() {
  const [currentScreen, setCurrentScreen] = useState("dashboard")

  const renderScreen = () => {
    switch (currentScreen) {
      case "dashboard":
        return <DashboardScreen />
      case "tracking":
        return <TripTrackingScreen />
      case "companions":
        return <CompanionManagementScreen />
      case "analytics":
        return <AnalyticsScreen />
      case "recommendations":
        return <RecommendationsScreen />
      case "rewards":
        return <RewardsScreen />
      case "weather":
        return <WeatherScreen />
      default:
        return <DashboardScreen />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileNavigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />

      {/* Main Content */}
      <div className="pt-16 pb-20 px-4">{renderScreen()}</div>
    </div>
  )
}
