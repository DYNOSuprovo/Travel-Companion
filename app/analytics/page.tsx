"use client"

import { useState } from "react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month")

  const stats = {
    totalDistance: 1250,
    totalTrips: 45,
    averageTrip: 27.8,
    totalTime: 156,
    favoriteMode: "car",
    carbonSaved: 280,
  }

  const monthlyData = [
    { month: "Jan", trips: 3, distance: 85 },
    { month: "Feb", trips: 4, distance: 120 },
    { month: "Mar", trips: 5, distance: 145 },
    { month: "Apr", trips: 6, distance: 180 },
    { month: "May", trips: 8, distance: 220 },
    { month: "Jun", trips: 9, distance: 250 },
  ]

  const transportBreakdown = [
    { mode: "Car", percentage: 45, trips: 20, color: "rgba(76, 175, 80, 0.8)" },
    { mode: "Bike", percentage: 25, trips: 11, color: "rgba(33, 150, 243, 0.8)" },
    { mode: "Walk", percentage: 20, trips: 9, color: "rgba(255, 152, 0, 0.8)" },
    { mode: "Bus", percentage: 10, trips: 5, color: "rgba(156, 39, 176, 0.8)" },
  ]

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ color: "white", fontSize: "28px", fontWeight: "bold", margin: "0 0 8px 0" }}>Analytics</h1>
          <p style={{ color: "rgba(255,255,255,0.8)", margin: 0 }}>Your travel insights and statistics</p>
        </div>

        {/* Time Range Selector */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "20px" }}>
          {["week", "month", "year"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                background: timeRange === range ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)",
                border: timeRange === range ? "2px solid rgba(255,255,255,0.6)" : "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px",
                padding: "10px",
                color: "white",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Key Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              padding: "16px",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: "0 0 8px 0" }}>Total Distance</p>
            <p style={{ color: "white", fontSize: "24px", fontWeight: "bold", margin: 0 }}>{stats.totalDistance} km</p>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              padding: "16px",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: "0 0 8px 0" }}>Total Trips</p>
            <p style={{ color: "white", fontSize: "24px", fontWeight: "bold", margin: 0 }}>{stats.totalTrips}</p>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              padding: "16px",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: "0 0 8px 0" }}>Avg Trip</p>
            <p style={{ color: "white", fontSize: "24px", fontWeight: "bold", margin: 0 }}>{stats.averageTrip} km</p>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              padding: "16px",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: "0 0 8px 0" }}>Total Time</p>
            <p style={{ color: "white", fontSize: "24px", fontWeight: "bold", margin: 0 }}>{stats.totalTime}h</p>
          </div>
        </div>

        {/* Monthly Trend */}
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            padding: "16px",
            border: "1px solid rgba(255,255,255,0.2)",
            marginBottom: "20px",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>
            Monthly Trend
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-around", height: "120px" }}>
            {monthlyData.map((data) => (
              <div key={data.month} style={{ textAlign: "center" }}>
                <div
                  style={{
                    background: "rgba(76, 175, 80, 0.8)",
                    borderRadius: "4px",
                    width: "30px",
                    height: `${(data.distance / 250) * 100}px`,
                    marginBottom: "8px",
                  }}
                />
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: 0 }}>{data.month}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Transport Breakdown */}
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            padding: "16px",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>
            Transport Breakdown
          </p>
          {transportBreakdown.map((item) => (
            <div key={item.mode} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>{item.mode}</span>
                <span style={{ color: "white", fontSize: "12px", fontWeight: "600" }}>{item.percentage}%</span>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                  height: "8px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: item.color,
                    height: "100%",
                    width: `${item.percentage}%`,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", margin: "4px 0 0 0" }}>
                {item.trips} trips
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
