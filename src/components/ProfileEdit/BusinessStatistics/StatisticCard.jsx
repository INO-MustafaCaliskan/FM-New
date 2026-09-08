"use client";

import React from "react";
import { Form } from "react-bootstrap";

import StatisticDonut from "@/components/ProfileEdit/BusinessStatistics/StatisticDonut";

export default function StatisticCard({
  title,
  chartData,
  twoColumnInputs = false,
  labels,
  colors,
  inputs,
}) {
  return (
    <div className="statistic-card">
      <h5 className="statistic-title">{title}</h5>

      <div className="statistic-chart-wrapper">
        <div className="statistic-chart">
          <StatisticDonut data={chartData} labels={labels} colors={colors} />
        </div>

        <div className="statistic-legend">
          {labels.map((label, index) => (
            <div key={label} className="statistic-legend-item">
              <span
                className="statistic-legend-color"
                style={{
                  backgroundColor: colors[index],
                }}
              />

              <span className="statistic-legend-label">{label}</span>

              <span className="statistic-legend-value">
                {chartData[index]}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`statistic-inputs ${
          twoColumnInputs ? "statistic-inputs-two" : ""
        }`}
      >
        {inputs.map((item) => (
        
            <div key={item.label} className="form-group">
              <Form.Label>{item.label}</Form.Label>

              <Form.Control
                type="number"

                max={100}
                placeholder="0"
                value={item.value}
                readOnly={item.readOnly}
                onChange={item.onChange}
                className="talk-form-control"
              />

              <span className="statistic-percent">%</span>
            </div>
         
        ))}
      </div>
    </div>
  );
}
