import React from "react";
import "./get-verified.css";
import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import ReviewsBadgeCard from "@/components/ReviewsBadgeCard/ReviewsBadgeCard";
import BadgeRelationship from "@/components/Verified/BadgeRelationship";
import BadgeHowToEarn from "@/components/Verified/BadgeHowToEarn";
import BadgeExamples from "@/components/Verified/BadgeExamples";
import VerificationProcess from "@/components/Verified/VerificationProcess";
import SystemBenefits from "@/components/Verified/SystemBenefits";
import { Card } from "react-bootstrap";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import {
  FaUser,
  FaCalendarAlt,
  FaShoppingCart,
  FaVideo,
  FaStar,
  FaGlobe,
  FaEnvelope,
  FaUsers,
  FaFileAlt,
  FaBuilding,
  FaUserFriends,
  FaCheckCircle,
} from "react-icons/fa";

const page = () => {
const badges = [
  {
    title: "VERIFIED USER",
    infoTitle: (
      <>
        Trusted Individual,
        <br />
        Verified Member
      </>
    ),
    subtitle: "BLUE BADGE",
    color: "#1565ff",
    lightColor: "#5282df14",
    icon: <RiVerifiedBadgeFill />,
    requirements: [
      {
        icon: <FaUser />,
        text: "Profile must be 100% completed",
      },
      {
        icon: <FaCalendarAlt />,
        text: "Account must be at least 90 days old",
      },
      {
        icon: <FaShoppingCart />,
        text: "At least 1 package must be purchased",
      },
      {
        icon: <FaVideo />,
        text: "At least 10 online meetings must be completed",
      },
      {
        icon: <FaStar />,
        text: "Must have received at least 1 review with 4 or 5 stars",
      },
    ],
    footerTitle: "Blue badge application is free.",
    footerText:
      "Requirements are automatically verified by the system.",
  },
  {
    title: "VERIFIED NETWORKER",
    subtitle: "ORANGE BADGE",
    infoTitle: (
      <>
        Active Networker,
        <br />
        Community Value Creator
      </>
    ),
    color: "#ff6a00",
    infoBodyTitle: "( You must hold a Blue Badge )",
    lightColor: "#ed945517",
    icon: <RiVerifiedBadgeFill />,
    requirements: [
      {
        icon: <FaVideo />,
        text: "At least 50 online meetings must be completed",
      },
      {
        icon: <FaStar />,
        text: "Must have received at least 5 reviews with 4 or 5 stars",
      },
      {
        icon: <FaGlobe />,
        text: "Must have connections from at least 3 different countries",
      },
      {
        icon: <FaCheckCircle />,
        text: "At least 10 online meetings must have been completed within the last 180 days",
      },
    ],
    footerTitle: "Orange badge cannot be purchased.",
    footerText:
      "It is awarded automatically based on your performance and reviewed periodically.",
  },
  {
    title: "VERIFIED COMPANY",
    subtitle: "GREEN BADGE",
    infoBodyTitle: "( You must hold a Blue Badge )",
    infoTitle: (
      <>
        Verified Company,
        <br />
        Corporate Trust
      </>
    ),
    color: "#16a34a",
    lightColor: "#78d39a1a",
    icon: <RiVerifiedBadgeFill />,
    requirements: [
      {
        icon: <FaFileAlt />,
        text: "Company documents must be submitted for verification",
      },
      {
        icon: <FaGlobe />,
        text: "Company website is required",
      },
      {
        icon: <FaEnvelope />,
        text: "Corporate email address is required",
      },
      {
        icon: <FaUsers />,
        text: "At least 3 references from existing members",
      },
      {
        icon: <FaUserFriends />,
        text: "At least 3 industry references who are not members",
      },
    ],
    footerTitle: "Verification is conducted manually.",
    footerText: "A one-time review fee applies.",
  },
];

  return (
    <div className="container">
      <InoBreadcrumb linkName="Get Verified" />
      <Card className="p-3">
        <div className="get-verified-wrapper">
          <div className="get-verified-heading ">
            <h1 className="m-0">Freight Talk Verification Badges</h1>

            <p className="mt-3">
              Establish trusted connections and expand your business.
            </p>

            <p>
              Our badges are not available for purchase,{" "}
              <span>they are earned through merit.</span>
            </p>
          </div>

          <div className="get-verified-grid">
            {badges.map((badge, index) => (
              <ReviewsBadgeCard key={index} {...badge} />
            ))}
          </div>
        </div>

        <BadgeRelationship />

        <BadgeHowToEarn />

        <BadgeExamples />

        <VerificationProcess />

        <SystemBenefits />
      </Card>
    </div>
  );
};

export default page;
