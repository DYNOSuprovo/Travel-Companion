export default function SimplePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "16px" }}>Travel Companion App</h1>
        <p style={{ fontSize: "18px", color: "#666" }}>Welcome to your travel companion!</p>
      </div>
    </div>
  )
}
