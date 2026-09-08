import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import "./verified.css";

const users = [
  {
    name: "Michael Anderson",
    title: "Logistics Director",
    company: "Global Freight Solutions",
    country: "Hamburg, Germany",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    badges: {
      user: false,
      company: false,
      networker: false,
    },
  },
  {
    name: "Sarah Johnson",
    title: "Supply Chain Manager",
    company: "Atlantic Cargo Group",
    country: "London, United Kingdom",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    badges: {
      user: true,
      company: false,
      networker: true,
    },
  },
  {
    name: "David Rodriguez",
    title: "Chief Executive Officer",
    company: "TransWorld Logistics",
    country: "Madrid, Spain",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    badges: {
      user: true,
      company: true,
      networker: true,
    },
  },
];

const BadgeExamples = () => {
  return (
    <div className="verified-examples-wrapper">
      <h2 className="verified-examples-title">
        WHAT DO BADGES LOOK LIKE? (EXAMPLES)
      </h2>

      <div className="verified-examples-grid">
        {users.map((user, index) => (
          <div key={index} className="verified-examples-card">
            <div className="verified-examples-avatar-wrapper">
              <img
                src={user.image}
                alt={user.name}
                className="verified-examples-avatar"
              />

              <span className="verified-examples-online" />
            </div>

            <h3>{user.name}</h3>

            <h4>{user.title}</h4>

            <p>{user.company}</p>

            <div className="verified-examples-location">
              <FaMapMarkerAlt />
              <span>{user.country}</span>
            </div>

            <div className="verified-examples-badges">
              <div className="verified-examples-badge-item">
                <RiVerifiedBadgeFill
                  className={user.badges.user ? "active user" : ""}
                />
                <span style={{maxWidth:"70px"}}>Verified User</span>
              </div>

              <div className="verified-examples-badge-item">
                <RiVerifiedBadgeFill
                  className={user.badges.networker ? "active networker" : ""}
                />
                <span style={{maxWidth:"80px"}}>Verified Networker</span>
              </div>
              <div className="verified-examples-badge-item">
                <RiVerifiedBadgeFill
                  className={user.badges.company ? "active company" : ""}
                />
                <span style={{maxWidth:"80px"}}>Verified Company</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgeExamples;
