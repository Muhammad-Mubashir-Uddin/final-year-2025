import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TotalOrders = () => {
  const [filter, setFilter] = useState("This year");

  // Sample data for the chart
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Orders",
        data: [50, 70, 60, 80, 90, 100, 110, 120, 130, 140, 150, 160],
        borderColor: "rgb(14, 29, 83)", // Green Line
        backgroundColor: "rgba(14, 29, 83, 0.2)", // Light Green fill
        tension: 0.4, // Smooth curve
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hides the legend
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hides grid lines on the X-axis
        },
      },
      y: {
        grid: {
          display: false, // Hides grid lines on the Y-axis
        },
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "580px",
        // height: "300px",
        background: "#fff",
        borderRadius: "10px",
        padding: "20px",
        // boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>Total Orders</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "5px",
            fontSize: "14px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <option>This year</option>
          <option>This month</option>
          <option>This week</option>
          <option>Past 1 year</option>
          <option>Maximum</option>
        </select>
      </div>
      <div style={{ height: "200px", marginTop: "20px" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default TotalOrders;
