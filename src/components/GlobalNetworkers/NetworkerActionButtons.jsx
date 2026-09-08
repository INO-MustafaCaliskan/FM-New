import React from "react";
import { useRouter } from "next/navigation";

import {
  faQuoteLeft,
  faPlane,
  faBox,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./networker-action-buttons.css";
import { useUser } from "@/context/UserContext";

const NetworkerActionButtons = () => {
  const router = useRouter();
  const { user } = useUser();
  const actions = [
    // {
    //   id: "air-tracking",
    //   label: "AIR TRACKING",
    //   icon: faPlane,
    //   color: "btn-air-tracking",
    //   bgColor: "#2196F3",
    // },
    // {
    //   id: "container-tracking",
    //   label: "CONTAINER TRACKING",
    //   icon: faBox,
    //   color: "btn-container-tracking",
    //   bgColor: "#009688",
    // },
    // {
    //   id: "freight-index",
    //   label: "FREIGHT INDEX",
    //   icon: faChartLine,
    //   color: "btn-freight-index",
    //   bgColor: "#9C27B0",
    // },
  ];
  if (
    user != null &&
    (
      user?.categoryName === "3PLs & Logistics Services" ||
      user?.categoryName === "Freight Forwarder" ||
      user?.categoryName === "Customs Broker" ||
      user?.categoryName === "Maritime Transport" ||
      user?.categoryName === "Transportation"
    )
  ) {
    actions.push({
      id: "get-quote",
      label: "GET QUOTE",
      icon: faQuoteLeft,
      color: "btn-get-quote",
      bgColor: "#4CAF50",
    });
  }
  const handleActionClick = (actionId) => {
    router.push(`/${actionId}`);
  };

  return (
    <div className="networker-page-actions-bar">
      <div className="networker-page-actions-container">
        {actions.map((action) => (
          <button
            key={action.id}
            className={`networker-page-action-btn ${action.color}`}
            onClick={() => handleActionClick(action.id)}
            title={action.label}
          >
            <FontAwesomeIcon
              icon={action.icon}
              className="networker-page-action-icon"
            />
            <span className="action-label">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NetworkerActionButtons;
