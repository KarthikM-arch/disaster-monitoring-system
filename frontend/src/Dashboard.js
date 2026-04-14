import React, { useState } from "react";
import MapComponent from "./MapComponent";

function Dashboard() {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const res = await fetch(
      "/api/predict-live?lat=12.98&lon=77.43&email=test@gmail.com"
    );
    const result = await res.json();
    setData(result);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🌦 Disaster Monitoring Dashboard</h1>

      <button onClick={fetchData} style={styles.button}>
        Get Live Data
      </button>

      {data && (
        <div style={styles.grid}>
          
          {/* Weather Card */}
          <div style={styles.card}>
            <h2>{data.city}</h2>
            <h1>{data.temperature}°C</h1>
            <p>Humidity: {data.humidity}%</p>
            <p>Risk: {data.risk}</p>
          </div>

          {/* Map */}
          <div style={styles.card}>
            <MapComponent lat={12.98} lon={77.43} />
          </div>

          {/* Chart Placeholder */}
          <div style={styles.card}>
            <h3>📊 Risk Overview</h3>
            <p>Chart coming soon...</p>
          </div>

        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: "#0f172a",
    minHeight: "100vh",
    color: "white",
    padding: "20px",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "10px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 0 10px rgba(0,0,0,0.5)",
  },
};

export default Dashboard;