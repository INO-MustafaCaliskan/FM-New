"use client";

import { useEffect, useRef, useState } from "react";
import ProfileCompletion from "@/components/ProfileEdit/ProfileCompletion/ProfileComplation";
import StepProfileSidebar from "@/components/ProfileEdit/StepProfileSidebar/StepProfileSidebar";
import PersonalInformation from "@/components/ProfileEdit/PersonalInformation/PersonalInformation";
import CompanyInformation from "@/components/ProfileEdit/CompanyInformation/CompanyInformation";
import BusinessProfile from "@/components/ProfileEdit/BusinessProfile/BusinessProfile";
import ServicesExpertise from "@/components/ProfileEdit/ServicesExpertise/ServicesExpertise";
import BusinessStatistics from "@/components/ProfileEdit/BusinessStatistics/BusinessStatistics";
import GlobalCoverage from "@/components/ProfileEdit/GlobalCoverage/GlobalCoverage";
import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";

import client from "@/utils/client";
import { useUser } from "@/context/UserContext";

import "./profile-edit.css";

const EXTENDED_PROFILE_CATEGORIES = [
  "3PLs & Logistics Services",
  "Freight Forwarder",
  "Customs Broker",
  "Maritime Transport",
  "Transportation",
];

const isExtendedProfileFlow = (categoryName) =>
  Boolean(categoryName) && EXTENDED_PROFILE_CATEGORIES.includes(categoryName);

export default function ProfileEditPage() {
  const [editProfileData, setEditProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(1);
  const { user } = useUser();

  const personalRef = useRef(null);
  const companyRef = useRef(null);
  const businessRef = useRef(null);
  const servicesRef = useRef(null);
  const statisticsRef = useRef(null);
  const globalRef = useRef(null);

  const isExtendedFlow = isExtendedProfileFlow(user?.categoryName);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const response = await client.get("/User/GetLoginUserEditProfile");
      setEditProfileData(response.data?.data ?? null);


    } catch (error) {
      console.error("Failed to load profile edit data", error);
      setEditProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  useEffect(() => {
    if (!isExtendedFlow) {
      setActiveStep(1);
    }
  }, [isExtendedFlow]);

  const handleStepClick = (step) => {
    if (!isExtendedFlow && step > 2) {
      return;
    }

    setActiveStep(step);

    const refsByStep = {
      1: personalRef,
      2: companyRef,
      3: businessRef,
      4: servicesRef,
      5: statisticsRef,
      6: globalRef,
    };

    const targetRef = refsByStep[step];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  // const handleSectionUpdate = (responseData, section, completionSection) => {
  //   setEditProfileData((prev) => ({
  //     ...prev,
  //     profileCompletionPercentage:
  //       responseData?.profileCompletionPercentage ??
  //       prev.profileCompletionPercentage,

  //     [completionSection]:
  //       responseData?.requestDataCompletionPercentage ??
  //       prev[completionSection],

  //     [section]: responseData?.requestData ?? prev[section],
  //   }));
  // };
  return (
    <div className="container">
      <InoBreadcrumb linkName="Edit Profile" />

      <div className="profile-edit-page">
        <div className="profile-edit-sidebar">
          <ProfileCompletion
            percentage={editProfileData?.profileCompletionPercentage ?? 0} slug={editProfileData?.personalInformation?.slug}
          />
          <StepProfileSidebar
            editProfileData={editProfileData}
            activeStep={activeStep}
            onStepClick={handleStepClick}
            isExtendedFlow={isExtendedFlow}
          />
        </div>

        <div className="profile-edit-content">
          <div ref={personalRef}>
            <PersonalInformation
              personalInformation={editProfileData?.personalInformation}
              loading={loading}
              onUpdate={loadProfileData}

            />
          </div>

          <div ref={companyRef}>
            <CompanyInformation
              companyInformation={editProfileData?.companyInformation}
              loading={loading}
              onUpdate={loadProfileData}

            />
          </div>

          {isExtendedFlow && (
            <>
              <div ref={businessRef}>
                <BusinessProfile
                  businessProfile={editProfileData?.businessProfile}
                  onUpdate={loadProfileData}
                />
              </div>

              <div ref={servicesRef}>
                <ServicesExpertise
                  servicesAndExpertise={editProfileData?.servicesAndExpertise}
                  onUpdate={loadProfileData}
                />
              </div>

              <div ref={statisticsRef}>
                <BusinessStatistics
                  businessStatistics={editProfileData?.businessStatistics}
                  onUpdate={loadProfileData}
                />
              </div>

              <div ref={globalRef}>
                <GlobalCoverage
                  globalCoverage={editProfileData?.globalCoverage}
                  onUpdate={loadProfileData}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
