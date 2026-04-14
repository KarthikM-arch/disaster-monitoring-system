import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { useEffect } from "react";

// ✅ Green marker (selected)
const greenIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
});

// ✅ Red marker (history)
const redIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
});


// 📍 Click to select location
function LocationMarker({ setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
}


// 🎯 Auto center map when position changes
function Recenter({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 6);
    }
  }, [position]);

  return null;
}


// 🔥 Heatmap layer
function Heatmap({ markers }) {
  const map = useMap();

  useEffect(() => {
    if (!markers || markers.length === 0) return;

    const heatData = markers.map(m => [
      parseFloat(m.lat),
      parseFloat(m.lon),
      m.risk_score || 0.5
    ]);

    const heatLayer = L.heatLayer(heatData, { radius: 25 }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [markers]);

  return null;
}


const MapComponent = ({ position, setPosition, markers = [] }) => {
  return (
    <MapContainer
      center={position || [20, 78]}
      zoom={4}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* 📍 Click handler */}
      <LocationMarker setPosition={setPosition} />

      {/* 🎯 Auto center */}
      <Recenter position={position} />

      {/* 🗺️ Heatmap */}
      <Heatmap markers={markers} />

      {/* 🔴 Multiple markers (history) */}
      {markers.map((m, i) => (
        <Marker key={i} position={[m.lat, m.lon]} icon={redIcon}>
          <Popup>
            <b>{m.city}</b> <br />
            🌡 {m.temperature}°C <br />
            💧 {m.humidity}% <br />
            ⚠ {m.risk}
          </Popup>
        </Marker>
      ))}

      {/* 🟢 Selected location */}
      {position && (
        <Marker position={position} icon={greenIcon}>
          <Popup>📍 Selected Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapComponent;