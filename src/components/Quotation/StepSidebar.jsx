"use client";

import { FaCheck } from "react-icons/fa";

import { useQuotation } from "@/context/QuotationContext";

export default function StepSidebar() {
  const { currentStep, setCurrentStep, visitedSteps } = useQuotation();

  const steps = [
    "Shipping Mode",
    "Delivery Term",
    "Shipping From",
    "Shipping To",
    "Shipping Type",
    "Cargo Details",
    "Ready to Load",
  ];
  const getStepStatus = (stepNumber) => {
    if (stepNumber === currentStep) {
      return "active";
    }

    if (visitedSteps.includes(stepNumber)) {
      return "completed";
    }

    return "pending";
  };
  return (
    <div className="card rfq-sidebar">
      <p className="sidebar-header">
        Step {currentStep} of {steps.length}
      </p>

      <div>
        {steps.map((step, index) => {
          const stepNumber = index + 1;

          const status = getStepStatus(stepNumber);

          return (
            <div
              key={index}
              className={`sidebar-step ${status}`}
              onClick={() => {
                if (visitedSteps.includes(stepNumber)) {
                  setCurrentStep(stepNumber);
                }
              }}
            >
              <span className={`step-number ${status}`}>
                {status === "completed" ? <FaCheck size={11} /> : stepNumber}
              </span>

              <span>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
