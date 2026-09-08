import React from "react";
import { AiFillInfoCircle } from "react-icons/ai";
const ReviewsBadgeCard = ({
  icon,
  lightColor,
  title,
  subtitle,
  infoTitle,
  color,
  infoBodyTitle,
  requirements,
  footerTitle,
  footerText,
}) => {
  return (
    <div className="get-verified-badge-card">
      <div
        className="get-verified-badge-header"
        style={{ borderTopColor: color, backgroundColor: lightColor }}
      >
        <div
          className="get-verified-badge-icon"
          style={{ background: "none", color: color }}
        >
          {icon}
        </div>

        <div>
          <h3 className="get-verified-badge-title" style={{ color: color }}>
            {title}
          </h3>
          <h3 className="get-verified-subtitle" style={{ color: color }}>
            {subtitle}
          </h3>
          <p className="get-verified-badge-subtitle">{infoTitle}</p>
        </div>
      </div>

      <div className="get-verified-badge-body">
        <h4
          className="get-verified-requirements-title mb-2"
          style={{ color: color }}
        >
          REQUIREMENTS
        </h4>
        <h4 className="get-verified-requirements-title"  style={{ fontSize: "15px", color: color, minHeight: "1.2em" }}>{infoBodyTitle}</h4>
        <ul className="get-verified-requirements-list">
          {requirements.map((item, index) => (
            <li key={index}>
              <span className="get-verified-requirement-icon" style={{ color }}>
                {item.icon}
              </span>

              <span className="mt-2">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="get-verified-badge-footer ">
        <div>
          <AiFillInfoCircle
            style={{ color: color, width: 28, fontSize: "28px" }}
          />
        </div>

        <div>
          <strong style={{ color }}>{footerTitle}</strong>
          <p>{footerText}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewsBadgeCard;
