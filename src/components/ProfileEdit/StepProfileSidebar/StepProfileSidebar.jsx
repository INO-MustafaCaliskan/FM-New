"use client";

import { useRouter } from "next/navigation";
import {
  FaCheckCircle,
  FaUserFriends,
  FaSearch,
  FaShieldAlt,
  FaHandshake,
} from "react-icons/fa";

import "./step-profile-sidebar.css";

export default function StepProfileSidebar({
  editProfileData,
  activeStep,
  onStepClick,
  isExtendedFlow = false,
}) {
  const router = useRouter();

  const handleContactSupport = () => {
    router.push("/contact-us");
  };

  const steps = isExtendedFlow
    ? [
        {
          id: 1,
          title: "Personal Information",
          value: editProfileData?.personalInformationCompletionPercentage ?? 0,
          total: 15,
        },
        {
          id: 2,
          title: "Company Information",
          value: editProfileData?.companyInformationCompletionPercentage ?? 0,
          total: 15,
        },
        {
          id: 3,
          title: "Business Profile",
          value: editProfileData?.businessProfileCompletionPercentage ?? 0,
          total: 20,
        },
        {
          id: 4,
          title: "Services & Expertise",
          value: editProfileData?.servicesExpertiseCompletionPercentage ?? 0,
          total: 20,
        },
        {
          id: 5,
          title: "Business Statistics",
          value: editProfileData?.businessStatisticsCompletionPercentage ?? 0,
          total: 15,
        },
        {
          id: 6,
          title: "Global Coverage",
          value: editProfileData?.globalCoverageCompletionPercentage ?? 0,
          total: 15,
        },
      ]
    : [
        {
          id: 1,
          title: "Personal Information",
          value: editProfileData?.personalInformationCompletionPercentage ?? 0,
          total: 50,
        },
        {
          id: 2,
          title: "Company Information",
          value: editProfileData?.companyInformationCompletionPercentage ?? 0,
          total: 50,
        },
      ];

  return (
    <div className="profile-edit-sidebar">
      <div className="profile-edit-sidebar-steps">
        {steps.map((step) => {
          const complete = step.value >= step.total;
          const active = step.id === activeStep;

          return (
            <div
              key={step.id}
              className={`profile-edit-sidebar-step ${
                active ? "active" : ""
              } ${complete ? "complete" : ""}`}
              onClick={() => onStepClick(step.id)}
            >
              <div className="step-circle">
                {complete ? <FaCheckCircle size={14} /> : step.id}
              </div>

              <div className="step-content">
                <h4>{step.title}</h4>
                <span>
                  % {step.value} / {step.total}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="profile-edit-sidebar-info">
        <h3>Why complete your profile?</h3>
        <ul>
          <li>
            <FaUserFriends className="profile-edit-sidebar-benefit-icon" />
            <span>Get more connection requests</span>
          </li>
          <li>
            <FaSearch className="profile-edit-sidebar-benefit-icon" />
            <span>Appear in more search results</span>
          </li>
          <li>
            <FaShieldAlt className="profile-edit-sidebar-benefit-icon" />
            <span>Build trust with verified profile</span>
          </li>
          <li>
            <FaHandshake className="profile-edit-sidebar-benefit-icon" />
            <span>Unlock new business opportunities</span>
          </li>
        </ul>
      </div>

      <div className="profile-edit-sidebar-support">
        <h3>Need Help?</h3>
        <p>Our support team is here to help you.</p>
        <button onClick={handleContactSupport}>Contact Support</button>
      </div>
    </div>
  );
}