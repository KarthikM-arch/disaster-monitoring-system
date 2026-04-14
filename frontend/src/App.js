import React, { useState, useEffect } from "react";
import MapComponent from "./MapComponent";
import ChartComponent from "./ChartComponent";
import "./App.css";

// ✅ ADD THIS (YOUR BACKEND URL)
const BASE_URL = "https://disaster-monitoring-system-1.onrender.com";

function App() {
  const [data, setData] = useState(null);
  const [position, setPosition] = useState(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [news, setNews] = useState([]);

  // 🌍 Load history
  const loadHistory = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/get-history`);
      const result = await res.json();
      setMarkers(result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // 📰 Fetch disaster news
  const fetchNews = async (cityName) => {
    try {
      if (!cityName) return;

      const res = await fetch(`${BASE_URL}/api/get-news?city=${cityName}`);
      const result = await res.json();

      if (Array.isArray(result)) {
        setNews(result);
      } else {
        setNews([]);
      }
    } catch (err) {
      console.error("News error:", err);
      setNews([]);
    }
  };

  // 🔎 Search city
  const searchCity = async () => {
    if (!city) return alert("Enter a city");

    try {
      setLoading(true);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${city}`
      );
      const result = await res.json();

      if (result.length > 0) {
        const lat = parseFloat(result[0].lat);
        const lon = parseFloat(result[0].lon);

        setPosition({ lat, lng: lon });
        fetchData(lat, lon);
      } else {
        alert("City not found ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Search failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // 📡 Fetch data
  const fetchData = async (lat, lon) => {
    try {
      setLoading(true);

      const res = await fetch(
        `${BASE_URL}/api/predict-live?lat=${lat}&lon=${lon}&email=test@gmail.com`
      );

      const result = await res.json();
      setData(result);

      if (result.risk === "High") {
        alert("🚨 HIGH RISK AREA!");
      }

      fetchNews(result.city);
      loadHistory();
    } catch (err) {
      console.error(err);
      alert("Failed to fetch data ❌");
    } finally {
      setLoading(false);
    }
  };

  // 📍 Use current location
  const useMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setPosition({ lat, lng: lon });
        fetchData(lat, lon);
      },
      () => alert("Location access denied ❌")
    );
  };

  // 📡 Selected location
  const fetchSelectedLocation = () => {
    if (!position) return alert("Select a location first");
    fetchData(position.lat, position.lng);
  };

  return (
    <div className="main">

      <div className="top-bar">
        <input
          type="text"
          placeholder="Search city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={searchCity}>Search</button>
      </div>

      <div className="content">

        <div className="left">
          <h1>🌍 Disaster Dashboard</h1>

          <div className="btn-group">
            <button onClick={useMyLocation}>📍 Use My Location</button>
            <button onClick={fetchSelectedLocation}>📡 Get Data</button>
          </div>

          {loading && <p>Loading...</p>}

          {position && (
            <p className="coords">
              📍 {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
            </p>
          )}

          {data && (
            <div className="stats">
              <div className="stat-card">🌡 {data.temperature}°C</div>
              <div className="stat-card">💧 {data.humidity}%</div>
              <div className="stat-card">⚠ {data.risk}</div>
            </div>
          )}

          <div className="card">
            <ChartComponent history={markers} />
          </div>

          <div className="card">
            <h3>📰 Disaster News</h3>

            {news.length === 0 ? (
              <p>No relevant news found</p>
            ) : (
              news.map((n, i) => (
                <div
                  key={i}
                  className={`news-card ${data?.risk?.toLowerCase()}`}
                >
                  {n.image && <img src={n.image} alt="news" />}
                  <div>
                    <h4>{n.title}</h4>
                    <p>{n.description}</p>
                    <a href={n.url} target="_blank" rel="noreferrer">
                      Read more →
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="right">
          <div className="card">
            {data ? (
              <>
                <h2>{data.city}</h2>
                <h1>{data.temperature}°C</h1>
                <p>Humidity: {data.humidity}%</p>
                <p>Risk: {data.risk}</p>
              </>
            ) : (
              <p>No data yet</p>
            )}
          </div>

          <div className="map-card">
            <MapComponent
              position={position}
              setPosition={setPosition}
              markers={markers}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;