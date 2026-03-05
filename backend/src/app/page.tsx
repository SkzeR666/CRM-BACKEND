export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0b0d10", color: "#f4f6f8", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>CRM Backend API</h1>
        <p style={{ opacity: 0.75 }}>Service online. Use os endpoints em /api/*</p>
      </div>
    </main>
  );
}
