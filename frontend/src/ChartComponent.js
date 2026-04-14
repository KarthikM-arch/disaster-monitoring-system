import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const ChartComponent = ({ history }) => {

  // ✅ Handle empty data
  if (!history || history.length === 0) {
    return <p style={{ textAlign: "center" }}>No data available</p>;
  }

  // ✅ Sort data by time (important)
  const sortedData = [...history].reverse();

  return (
    <div style={{ height: 250, padding: "10px" }}>
      <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
        📊 Temperature Trend
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={sortedData}>
          
          {/* Grid */}
          <CartesianGrid strokeDasharray="3 3" stroke="#555" />

          {/* X Axis */}
          <XAxis 
            dataKey="time" 
            stroke="#ccc"
          />

          {/* Y Axis */}
          <YAxis 
            stroke="#ccc"
          />

          {/* Tooltip */}
          <Tooltip 
            contentStyle={{ backgroundColor: "#1e293b", border: "none" }}
          />

          {/* Line */}
          <Line 
            type="monotone" 
            dataKey="temperature" 
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4 }}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;