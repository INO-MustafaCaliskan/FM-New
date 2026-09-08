"use client";

import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function StatisticDonut({
  data,
  labels,
  colors,
}) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label(context) {
            return `${context.label}: ${context.parsed}%`;
          },
        },
      },
    },
    animation: {
      duration: 500,
    },
  };

  return (
    <div className="statistic-donut">
      <Doughnut
        data={chartData}
        options={options}
      />
    </div>
  );
}