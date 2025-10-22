"use client"

import { useState } from "react"

export default function RewardsPage() {
  const [selectedBadge, setSelectedBadge] = useState<number | null>(null)

  const badges = [
    { id: 1, name: "Explorer", icon: "🗺️", description: "Completed 10 trips", earned: true, date: "Jan 15" },
    {
      id: 2,
      name: "Eco Traveler",
      icon: "🌱",
      description: "Used eco-friendly transport 20 times",
      earned: true,
      date: "Feb 20",
    },
    {
      id: 3,
      name: "Night Owl",
      icon: "🌙",
      description: "Completed 5 trips after 10 PM",
      earned: true,
      date: "Mar 10",
    },
    {
      id: 4,
      name: "Marathon Runner",
      icon: "🏃",
      description: "Traveled 500 km in a month",
      earned: false,
      progress: 65,
    },
    {
      id: 5,
      name: "Social Butterfly",
      icon: "🦋",
      description: "Traveled with 10 different companions",
      earned: false,
      progress: 40,
    },
    { id: 6, name: "Speed Demon", icon: "⚡", description: "Average speed over 60 km/h", earned: false, progress: 55 },
  ]

  const challenges = [
    { id: 1, name: "Weekend Warrior", description: "Complete 3 trips this weekend", reward: 50, progress: 2 },
    { id: 2, name: "Green Challenge", description: "Use bike or walk for 5 trips", reward: 100, progress: 3 },
    { id: 3, name: "Social Traveler", description: "Travel with a companion 3 times", reward: 75, progress: 1 },
  ]

  const userStats = {
    points: 2450,
    level: 8,
    nextLevelPoints: 3000,
    totalRedeemed: 1200,
  }

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
          <h1 style={{ color: "white", fontSize: "28px", fontWeight: "bold", margin: "0 0 8px 0" }}>Rewards</h1>
          <p style={{ color: "rgba(255,255,255,0.8)", margin: 0 }}>Earn badges and unlock achievements</p>
        </div>

        {/* User Level */}
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            padding: "20px",
            border: "1px solid rgba(255,255,255,0.2)",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px", margin: "0 0 8px 0" }}>Your Level</p>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>⭐</div>
          <p style={{ color: "white", fontSize: "32px", fontWeight: "bold", margin: "0 0 8px 0" }}>
            Level {userStats.level}
          </p>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: "8px",
              height: "8px",
              marginBottom: "8px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "rgba(76, 175, 80, 0.8)",
                height: "100%",
                width: `${(userStats.points / userStats.nextLevelPoints) * 100}%`,
              }}
            />
          </div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: 0 }}>
            {userStats.points} / {userStats.nextLevelPoints} points
          </p>
        </div>

        {/* Points Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              padding: "16px",
              border: "1px solid rgba(255,255,255,0.2)",
              textAlign: "center",
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: "0 0 8px 0" }}>Total Points</p>
            <p style={{ color: "white", fontSize: "24px", fontWeight: "bold", margin: 0 }}>{userStats.points}</p>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              padding: "16px",
              border: "1px solid rgba(255,255,255,0.2)",
              textAlign: "center",
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: "0 0 8px 0" }}>Redeemed</p>
            <p style={{ color: "white", fontSize: "24px", fontWeight: "bold", margin: 0 }}>{userStats.totalRedeemed}</p>
          </div>
        </div>

        {/* Badges */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>
            Badges
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {badges.map((badge) => (
              <button
                key={badge.id}
                onClick={() => setSelectedBadge(selectedBadge === badge.id ? null : badge.id)}
                style={{
                  background: badge.earned ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                  border:
                    selectedBadge === badge.id ? "2px solid rgba(255,255,255,0.6)" : "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  padding: "16px",
                  color: "white",
                  cursor: "pointer",
                  opacity: badge.earned ? 1 : 0.6,
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>{badge.icon}</div>
                <p style={{ fontSize: "12px", fontWeight: "600", margin: "0 0 4px 0" }}>{badge.name}</p>
                {!badge.earned && (
                  <div
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "4px",
                      height: "4px",
                      marginTop: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(76, 175, 80, 0.8)",
                        height: "100%",
                        width: `${badge.progress}%`,
                      }}
                    />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Badge Details */}
        {selectedBadge && (
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
            {badges.map((badge) => {
              if (badge.id !== selectedBadge) return null
              return (
                <div key={badge.id}>
                  <div style={{ textAlign: "center", marginBottom: "12px" }}>
                    <div style={{ fontSize: "48px", marginBottom: "8px" }}>{badge.icon}</div>
                    <p style={{ color: "white", fontSize: "18px", fontWeight: "bold", margin: "0 0 4px 0" }}>
                      {badge.name}
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: 0 }}>{badge.description}</p>
                  </div>
                  {badge.earned && (
                    <p style={{ color: "rgba(76, 175, 80, 0.8)", fontSize: "12px", textAlign: "center", margin: 0 }}>
                      Earned on {badge.date}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Active Challenges */}
        <div>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>
            Active Challenges
          </p>
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                padding: "16px",
                border: "1px solid rgba(255,255,255,0.2)",
                marginBottom: "12px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <p style={{ color: "white", fontWeight: "600", margin: 0 }}>{challenge.name}</p>
                <p style={{ color: "rgba(76, 175, 80, 0.8)", fontWeight: "600", margin: 0 }}>+{challenge.reward} pts</p>
              </div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: "0 0 8px 0" }}>
                {challenge.description}
              </p>
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                  height: "6px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: "rgba(76, 175, 80, 0.8)",
                    height: "100%",
                    width: `${(challenge.progress / 3) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
