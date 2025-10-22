"use client"

import { useState } from "react"

export default function CompanionManagementPage() {
  const [companions, setCompanions] = useState([
    { id: 1, name: "Sarah Johnson", email: "sarah@example.com", trips: 12, status: "active" },
    { id: 2, name: "Mike Chen", email: "mike@example.com", trips: 8, status: "active" },
    { id: 3, name: "Emma Wilson", email: "emma@example.com", trips: 5, status: "pending" },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newCompanion, setNewCompanion] = useState({ name: "", email: "" })

  const handleAddCompanion = () => {
    if (newCompanion.name && newCompanion.email) {
      setCompanions([
        ...companions,
        {
          id: companions.length + 1,
          name: newCompanion.name,
          email: newCompanion.email,
          trips: 0,
          status: "pending",
        },
      ])
      setNewCompanion({ name: "", email: "" })
      setShowAddForm(false)
    }
  }

  const handleRemoveCompanion = (id: number) => {
    setCompanions(companions.filter((c) => c.id !== id))
  }

  const activeCompanions = companions.filter((c) => c.status === "active")
  const pendingCompanions = companions.filter((c) => c.status === "pending")

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
          <h1 style={{ color: "white", fontSize: "28px", fontWeight: "bold", margin: "0 0 8px 0" }}>
            Travel Companions
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", margin: 0 }}>
            {activeCompanions.length} active, {pendingCompanions.length} pending
          </p>
        </div>

        {/* Add Companion Button */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.2)",
            border: "2px dashed rgba(255,255,255,0.4)",
            borderRadius: "12px",
            padding: "16px",
            color: "white",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "20px",
            transition: "all 0.3s ease",
          }}
        >
          + Add Companion
        </button>

        {/* Add Companion Form */}
        {showAddForm && (
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
            <input
              type="text"
              placeholder="Name"
              value={newCompanion.name}
              onChange={(e) => setNewCompanion({ ...newCompanion, name: e.target.value })}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "8px",
                padding: "12px",
                color: "white",
                marginBottom: "12px",
                fontSize: "14px",
              }}
            />
            <input
              type="email"
              placeholder="Email"
              value={newCompanion.email}
              onChange={(e) => setNewCompanion({ ...newCompanion, email: e.target.value })}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "8px",
                padding: "12px",
                color: "white",
                marginBottom: "12px",
                fontSize: "14px",
              }}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <button
                onClick={handleAddCompanion}
                style={{
                  background: "rgba(76, 175, 80, 0.8)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Add
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: "8px",
                  padding: "12px",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Active Companions */}
        {activeCompanions.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>
              Active Companions
            </p>
            {activeCompanions.map((companion) => (
              <div
                key={companion.id}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  marginBottom: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p style={{ color: "white", fontWeight: "600", margin: "0 0 4px 0" }}>{companion.name}</p>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: "0 0 4px 0" }}>
                    {companion.email}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", margin: 0 }}>
                    {companion.trips} trips together
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveCompanion(companion.id)}
                  style={{
                    background: "rgba(244, 67, 54, 0.6)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    color: "white",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pending Companions */}
        {pendingCompanions.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>
              Pending Invitations
            </p>
            {pendingCompanions.map((companion) => (
              <div
                key={companion.id}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  marginBottom: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  opacity: 0.8,
                }}
              >
                <div>
                  <p style={{ color: "white", fontWeight: "600", margin: "0 0 4px 0" }}>{companion.name}</p>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: "0 0 4px 0" }}>
                    {companion.email}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", margin: 0 }}>Invitation pending</p>
                </div>
                <div style={{ fontSize: "20px" }}>⏳</div>
              </div>
            ))}
          </div>
        )}

        {/* Group Stats */}
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
            Group Statistics
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: "0 0 4px 0" }}>Total Trips</p>
              <p style={{ color: "white", fontSize: "20px", fontWeight: "bold", margin: 0 }}>
                {companions.reduce((sum, c) => sum + c.trips, 0)}
              </p>
            </div>
            <div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: "0 0 4px 0" }}>Total Members</p>
              <p style={{ color: "white", fontSize: "20px", fontWeight: "bold", margin: 0 }}>{companions.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
