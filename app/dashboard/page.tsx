"use client"

import { useState } from "react"

export default function DashboardPage() {
  const [currentScreen, setCurrentScreen] = useState("dashboard")

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid #eee",
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>Travel Companion</h1>
        <button
          style={{
            padding: "8px 16px",
            backgroundColor: "#f0f0f0",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto", paddingBottom: "100px" }}>
        {currentScreen === "dashboard" && (
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>Good Morning, Traveler!</h2>

            {/* Quick Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>Total Distance</div>
                <div style={{ fontSize: "28px", fontWeight: "bold" }}>1,247.5</div>
                <div style={{ fontSize: "12px", color: "#999" }}>km</div>
              </div>
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>Total Trips</div>
                <div style={{ fontSize: "28px", fontWeight: "bold" }}>89</div>
                <div style={{ fontSize: "12px", color: "#999" }}>trips</div>
              </div>
            </div>

            {/* Start Trip Card */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                textAlign: "center",
                marginBottom: "24px",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🗺️</div>
              <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>Start Your Journey</h3>
              <p style={{ fontSize: "14px", color: "#666", marginBottom: "16px" }}>
                Track your trip automatically or manually start a new journey
              </p>
              <button
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#007AFF",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Start New Trip
              </button>
            </div>

            {/* Recent Trips */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>Recent Trips</h3>
              {[
                { from: "Home", to: "Office", mode: "Car", distance: "12.5 km", time: "25 min" },
                { from: "Office", to: "Mall", mode: "Metro", distance: "8.2 km", time: "18 min" },
                { from: "Home", to: "Park", mode: "Walking", distance: "2.1 km", time: "22 min" },
              ].map((trip, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom: idx < 2 ? "1px solid #eee" : "none",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "500" }}>
                      {trip.from} → {trip.to}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {trip.mode} • {trip.distance} • {trip.time}
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#f0f0f0",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}
                  >
                    Completed
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentScreen === "tracking" && (
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>Trip Tracking</h2>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "40px 20px",
                textAlign: "center",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📍</div>
              <p style={{ fontSize: "16px", color: "#666" }}>No active trips. Start tracking your journey!</p>
            </div>
          </div>
        )}

        {currentScreen === "companions" && (
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>Companions</h2>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "40px 20px",
                textAlign: "center",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>👥</div>
              <p style={{ fontSize: "16px", color: "#666" }}>No companions added yet. Invite friends to join!</p>
            </div>
          </div>
        )}

        {currentScreen === "analytics" && (
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>Analytics</h2>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "40px 20px",
                textAlign: "center",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
              <p style={{ fontSize: "16px", color: "#666" }}>Your travel analytics will appear here</p>
            </div>
          </div>
        )}

        {currentScreen === "rewards" && (
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>Rewards</h2>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "40px 20px",
                textAlign: "center",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏆</div>
              <p style={{ fontSize: "16px", color: "#666" }}>Earn rewards as you travel more!</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "white",
          borderTop: "1px solid #eee",
          display: "flex",
          justifyContent: "space-around",
          padding: "8px 0",
          boxShadow: "0 -1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {[
          { id: "dashboard", label: "Dashboard", icon: "🏠" },
          { id: "tracking", label: "Tracking", icon: "📍" },
          { id: "companions", label: "Companions", icon: "👥" },
          { id: "analytics", label: "Analytics", icon: "📊" },
          { id: "rewards", label: "Rewards", icon: "🏆" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentScreen(item.id)}
            style={{
              flex: 1,
              padding: "12px 8px",
              backgroundColor: currentScreen === item.id ? "#f0f0f0" : "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
            }}
          >
            <div style={{ fontSize: "24px" }}>{item.icon}</div>
            <div style={{ fontSize: "11px", color: currentScreen === item.id ? "#007AFF" : "#666" }}>{item.label}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
