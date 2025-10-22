"use client"

import { useState, useEffect } from "react"

export default function TripTrackingPage() {
  const [isTracking, setIsTracking] = useState(false)
  const [transportMode, setTransportMode] = useState("car")
  const [distance, setDistance] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)

  useEffect(() => {
    if (!isTracking) return

    const interval = setInterval(() => {
      setDistance((prev) => prev + Math.random() * 0.1)
      setSpeed((prev) => {
        const newSpeed = Math.random() * 80 + 20
        return Math.round(newSpeed * 10) / 10
      })
      setDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isTracking])

  const handleStartTrip = () => {
    setIsTracking(true)
    setStartTime(new Date())
    setDistance(0)
    setDuration(0)
    setSpeed(0)
  }

  const handleStopTrip = () => {
    setIsTracking(false)
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const transportModes = [
    { id: "car", label: "Car", icon: "🚗" },
    { id: "bike", label: "Bike", icon: "🚴" },
    { id: "walk", label: "Walk", icon: "🚶" },
    { id: "bus", label: "Bus", icon: "🚌" },
    { id: "train", label: "Train", icon: "🚂" },
    { id: "flight", label: "Flight", icon: "✈️" },
  ]

  return (
    <div
      style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "20px" }}
    >
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ color: "white", fontSize: "28px", fontWeight: "bold", margin: "0 0 8px 0" }}>Trip Tracking</h1>
          <p style={{ color: "rgba(255,255,255,0.8)", margin: 0 }}>
            {isTracking ? "Trip in progress" : "Ready to start"}
          </p>
        </div>

        {/* Map Placeholder */}
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            padding: "40px 20px",
            textAlign: "center",
            marginBottom: "20px",
            border: "1px solid rgba(255,255,255,0.2)",
            minHeight: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div style={{ fontSize: "60px", marginBottom: "10px" }}>{isTracking ? "📍" : "🗺️"}</div>
          <p style={{ color: "rgba(255,255,255,0.8)", margin: 0 }}>
            {isTracking ? "Live tracking active" : "Map view"}
          </p>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              padding: "16px",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: "0 0 8px 0" }}>Distance</p>
            <p style={{ color: "white", fontSize: "24px", fontWeight: "bold", margin: 0 }}>{distance.toFixed(1)} km</p>
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
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: "0 0 8px 0" }}>Duration</p>
            <p style={{ color: "white", fontSize: "24px", fontWeight: "bold", margin: 0 }}>
              {formatDuration(duration)}
            </p>
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
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: "0 0 8px 0" }}>Speed</p>
            <p style={{ color: "white", fontSize: "24px", fontWeight: "bold", margin: 0 }}>{speed} km/h</p>
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
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: "0 0 8px 0" }}>Mode</p>
            <p style={{ color: "white", fontSize: "24px", fontWeight: "bold", margin: 0 }}>
              {transportModes.find((m) => m.id === transportMode)?.icon}
            </p>
          </div>
        </div>

        {/* Transport Mode Selection */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>
            Transport Mode
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px",
            }}
          >
            {transportModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => !isTracking && setTransportMode(mode.id)}
                disabled={isTracking}
                style={{
                  background: transportMode === mode.id ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)",
                  border:
                    transportMode === mode.id ? "2px solid rgba(255,255,255,0.6)" : "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  padding: "12px",
                  color: "white",
                  cursor: isTracking ? "not-allowed" : "pointer",
                  opacity: isTracking && transportMode !== mode.id ? 0.5 : 1,
                  transition: "all 0.3s ease",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                <div style={{ fontSize: "24px", marginBottom: "4px" }}>{mode.icon}</div>
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <button
            onClick={handleStartTrip}
            disabled={isTracking}
            style={{
              background: isTracking ? "rgba(255,255,255,0.1)" : "rgba(76, 175, 80, 0.8)",
              border: "none",
              borderRadius: "12px",
              padding: "16px",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: isTracking ? "not-allowed" : "pointer",
              opacity: isTracking ? 0.5 : 1,
              transition: "all 0.3s ease",
            }}
          >
            Start Trip
          </button>

          <button
            onClick={handleStopTrip}
            disabled={!isTracking}
            style={{
              background: !isTracking ? "rgba(255,255,255,0.1)" : "rgba(244, 67, 54, 0.8)",
              border: "none",
              borderRadius: "12px",
              padding: "16px",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: !isTracking ? "not-allowed" : "pointer",
              opacity: !isTracking ? 0.5 : 1,
              transition: "all 0.3s ease",
            }}
          >
            Stop Trip
          </button>
        </div>

        {/* Trip Summary */}
        {!isTracking && distance > 0 && (
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              padding: "16px",
              border: "1px solid rgba(255,255,255,0.2)",
              marginTop: "20px",
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>
              Trip Summary
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>Total Distance:</span>
              <span style={{ color: "white", fontWeight: "bold" }}>{distance.toFixed(1)} km</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>Duration:</span>
              <span style={{ color: "white", fontWeight: "bold" }}>{formatDuration(duration)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>Avg Speed:</span>
              <span style={{ color: "white", fontWeight: "bold" }}>
                {duration > 0 ? (((distance / (duration / 3600)) * 10) / 10).toFixed(1) : 0} km/h
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
