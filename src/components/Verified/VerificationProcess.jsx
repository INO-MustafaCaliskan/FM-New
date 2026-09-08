import React from "react";
import "./verified.css";
import { FaFileAlt, FaSearch, FaCheckCircle, FaEnvelope } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";

const VerificationProcess = () => {
  const steps = [
    {
      icon: <FaFileAlt />,
      title: "APPLICATION",
      text: "You submit your company documents and information.",
      color: "#EF6C00",
    },
    {
      icon: <FaSearch />,
      title: "REVIEW",
      text: "Our team reviews your documents and references.",
      color: "#EF6C00",
    },
    {
      icon: <FaCheckCircle />,
      title: "APPROVAL",
      text: "If everything meets the requirements, your badge is approved.",
      color: "#EF6C00",
    },
    {
      icon: <FaEnvelope />,
      title: "NOTIFICATION",
      text: "The result is sent to you via email.",
      color: "#EF6C00",
    },
  ];

  return (
    <div className="verification-process-wrapper">
      <h2 className="verification-process-title">
        VERIFICATION PROCESS (GREEN BADGE)
      </h2>

      <div className="verification-process-grid">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="verification-process-card">
              <div className="d-flex flex-column  align-items-center justify-content-center h-100">
                <div
                  className="verification-process-icon"
                  style={{ background: step.color }}
                >
                  {step.icon}
                </div>
              </div>
              <div className=" verification-process-text-info mt-3">
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </div>
            </div>

            {index !== steps.length - 1 && (
              <div className="verification-process-arrow">
                <FaArrowRightLong />
              </div>
            )}
          </React.Fragment>
        ))}

        <div className="verification-process-note">
          <p>
            The review process typically takes 3–5 business days. Additional
            documentation may be requested if necessary.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationProcess;
