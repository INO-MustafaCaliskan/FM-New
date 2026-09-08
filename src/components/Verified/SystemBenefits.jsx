import React from "react";
import "./verified.css";
import {
  FaShieldAlt,
  FaHandshake,
  FaChartLine,
  FaAward,
  FaLightbulb,
} from "react-icons/fa";
import { HiOutlineLightBulb } from "react-icons/hi";

const SystemBenefits = () => {
  const benefits = [
    {
      icon: <FaShieldAlt />,
      title: "BUILDS TRUST",
      text: "Helps you establish safer and more reliable business connections through verified profiles.",
      color: "#EF6C00",
    },
    {
      icon: <FaHandshake />,
      title: "QUALITY CONNECTIONS",
      text: "Increases your opportunities to connect with real professionals and verified companies.",
      color: "#EF6C00",
    },
    {
      icon: <FaChartLine />,
      title: "ENCOURAGES ENGAGEMENT",
      text: "Motivates you to create value through more meetings and reviews.",
      color: "#EF6C00",
    },
    {
      icon: <FaAward />,
      title: "ENHANCES CREDIBILITY",
      text: "Boosts your professional visibility and reputation.",
      color: "#EF6C00",
    },
  ];

  return (
    <div className="system-benefits-wrapper">
      <h2 className="system-benefits-title">BENEFITS OF THIS SYSTEM</h2>

      <div className="system-benefits-grid">
        {benefits.map((item, index) => (
          <div key={index} className="system-benefits-card">
            <div className="system-benefits-icon" style={{ color: item.color }}>
              {item.icon}
            </div>

            <div>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="system-benefits-footer">
        <HiOutlineLightBulb style={{ color: "#EF6C00" }} />

        <span>
          Badges cannot be bought — they must be earned. At Freight Talk, trust,
          transparency, and active participation are what create real value.
        </span>
      </div>
    </div>
  );
};

export default SystemBenefits;
