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

const RevenueCard = () => {
  const [filter, setFilter] = useState("This Year");

  // Mock data for each filter
  const mockData = {
    "This Year": Array(12)
      .fill()
      .map(() => Math.floor(Math.random() * 1000)),
    "This Month": Array(30)
      .fill()
      .map(() => Math.floor(Math.random() * 200)),
    "This Week": Array(7)
      .fill()
      .map(() => Math.floor(Math.random() * 100)),
    "Past 1 Year": Array(12)
      .fill()
      .map(() => Math.floor(Math.random() * 800)),
    Maximum: Array(12)
      .fill()
      .map(() => Math.floor(Math.random() * 1500)),
  };

  const labels = {
    "This Year": [
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
    "This Month": Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    "This Week": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    "Past 1 Year": [
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
    Maximum: [
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
  };

  const data = {
    labels: labels[filter],
    datasets: [
      {
        label: "Revenue",
        data: mockData[filter],
        borderColor: "rgb(21, 3, 69)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div
      style={{
        background: "#ffffff",
        // border: "1px solid #e0e0e0",
        borderRadius: "10px",
        padding: "20px",
        width: "100%",
        // height: "300px",
        maxWidth: "580px",
        // boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h4
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            // color: "#",
            margin: 0,
            color: "#052855",
          }}
        >
          Total Revenue
        </h4>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "5px 10px",
            fontSize: "14px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            outline: "none",
          }}
        >
          <option value="This Year">This Year</option>
          <option value="This Month">This Month</option>
          <option value="This Week">This Week</option>
          <option value="Past 1 Year">Past 1 Year</option>
          <option value="Maximum">Maximum</option>
        </select>
      </div>
      <div style={{ width: "100%", overflow: "hidden" }}>
        <Line
          data={data}
          options={{
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
                  display: false, // Hides the grid lines on the x-axis
                },
              },
              y: {
                grid: {
                  display: false, // Hides the grid lines on the y-axis
                },
                ticks: {
                  beginAtZero: true, // Optional: Ensures the y-axis starts at 0
                },
              },
            },
          }}
          height={200}
        />
      </div>
    </div>
  );
};

export default RevenueCard;
