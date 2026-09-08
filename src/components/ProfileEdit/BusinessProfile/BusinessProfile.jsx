"use client";

import "./business-profile.css";

import React, { useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import { useFormik } from "formik";
import { toast } from "react-toastify";

import client from "@/utils/client";
import StepCard from "../StepCard/StepCard";

export default function BusinessProfile({ businessProfile, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const whyPeopleConnectOptions = [
    "Reliable Overseas Partnerships",
    "Fast & Competitive Quotations",
    "Strong Local Market Expertise",
    "Import & Export Solutions",
    "Project Cargo Expertise",
    "Cross Trade Solutions",
    "Customs & Compliance Support",
    "Warehousing & Distribution Services",
    "Industry-Specific Logistics Expertise",
    "Responsive & Professional Communication",
  ];

  const interestedInOptions = [
    "New Agency Partnerships",
    "Import Opportunities",
    "Export Opportunities",
    "Cross Trade Business",
    "Project Cargo Opportunities",
    "RFQs & Freight Quotations",
    "Joint Business Development",
    "Warehousing & Distribution Partners",
    "Customs Brokerage Partners",
    "Industry-Specific Logistics Opportunities",
  ];

  const membershipOptions = [
    "Freight Forwarders Family Worldwide Agents Network",
    "Freight Midpoint International Forwarders Network",
    "Overseas Project Cargo Association",
    "Combined Logistics Networks",
    "GLA Global Logistics Alliance",
    "OLO Orange Logistics Organization",
    "X2 Logistics Networks",
    "JCtrans",
    "WCAworld",
    "FNC Freight Network Corporation",
  ];

  const whyPeopleConnectMap = {
    "Reliable Overseas Partnerships": "reliableOverseasPartnerships",
    "Fast & Competitive Quotations": "fastCompetitiveQuotations",
    "Strong Local Market Expertise": "strongLocalMarketExpertise",
    "Import & Export Solutions": "importExportSolutions",
    "Project Cargo Expertise": "projectCargoExpertise",
    "Cross Trade Solutions": "crossTradeSolutions",
    "Customs & Compliance Support": "customsComplianceSupport",
    "Warehousing & Distribution Services": "warehousingDistributionServices",
    "Industry-Specific Logistics Expertise": "industrySpecificLogisticsExpertise",
    "Responsive & Professional Communication": "responsiveProfessionalCommunication",
  };

  const interestedInMap = {
    "New Agency Partnerships": "newAgencyPartnerships",
    "Import Opportunities": "importOpportunities",
    "Export Opportunities": "exportOpportunities",
    "Cross Trade Business": "crossTradeBusiness",
    "Project Cargo Opportunities": "projectCargoOpportunities",
    "RFQs & Freight Quotations": "rfqsFreightQuotations",
    "Joint Business Development": "jointBusinessDevelopment",
    "Warehousing & Distribution Partners": "warehousingDistributionPartners",
    "Customs Brokerage Partners": "customsBrokeragePartners",
    "Industry-Specific Logistics Opportunities": "industrySpecificLogisticsOpportunities",
  };

  const membershipMap = {
    "Freight Forwarders Family Worldwide Agents Network": "isFFFMember",
    "Freight Midpoint International Forwarders Network": "isFMMember",
    "Overseas Project Cargo Association": "isOPCAMember",
    "Combined Logistics Networks": "isCLNMember",
    "GLA Global Logistics Alliance": "isGLAMember",
    "OLO Orange Logistics Organization": "isOLOMember",
    "X2 Logistics Networks": "isX2Member",
    "JCtrans": "isJCtransMember",
    "WCAworld": "isWCAworldMember",
    "FNC Freight Network Corporation": "isFNCMember",
  };

  const initialMapped = useMemo(() => {
    const bp = businessProfile || {};
    const why = whyPeopleConnectOptions.filter(
      (label) => bp[whyPeopleConnectMap[label]]
    );

    const interested = interestedInOptions.filter(
      (label) => bp[interestedInMap[label]]
    );

    const memberships = membershipOptions.filter(
      (label) => bp[membershipMap[label]]
    );

    return {
      whyPeopleConnect: why,
      interestedIn: interested,
      memberships,
    };
  }, [businessProfile]);

  const buildPayload = (values) => {
    const payload = {};

    Object.entries(whyPeopleConnectMap).forEach(([label, key]) => {
      payload[key] = (values.whyPeopleConnect || []).includes(label);
    });

    Object.entries(interestedInMap).forEach(([label, key]) => {
      payload[key] = (values.interestedIn || []).includes(label);
    });

    Object.entries(membershipMap).forEach(([label, key]) => {
      payload[key] = (values.memberships || []).includes(label);
    });

    return payload;
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      whyPeopleConnect: initialMapped.whyPeopleConnect,
      interestedIn: initialMapped.interestedIn,
      memberships: initialMapped.memberships,
    },

    onSubmit: async (values) => {
      try {
        setLoading(true);

        const response = await client.post(
          "/UserDetail/UpdateBusinessProfile",
          buildPayload(values),
        );

        if (response.data?.success) {
          onUpdate?.(response.data?.data);
          toast.success("Business profile updated.");
        } else {
          toast.error("Save failed.");
        }
      } catch (error) {
        console.error("Business profile update failed", error);
        toast.error("Save failed.");
      } finally {
        setLoading(false);
      }
    },
  });

  const toggleCheckbox = (field, value, maxSelection) => {
    const current = formik.values[field] || [];

    if (current.includes(value)) {
      formik.setFieldValue(
        field,
        current.filter((x) => x !== value),
      );
      return;
    }

    if (current.length >= maxSelection) {
      toast.warning(`You can select up to ${maxSelection} items.`);
      return;
    }

    formik.setFieldValue(field, [...current, value]);
  };

  const renderGroup = (title, field, options, maxSelection) => {
    return (
      <div className="business-profile-card">
        <div className="business-profile-card-title">
          <h5>{title}</h5>

          <span>(Select up to {maxSelection})</span>
        </div>

        <div className="business-profile-options">
          {options.map((item) => (
            <Form.Check
              key={item}
              type="checkbox"
              id={`${field}-${item}`}
              label={item}
              checked={(formik.values[field] || []).includes(item)}
              onChange={() => toggleCheckbox(field, item, maxSelection)}
            />
          ))}
        </div>

        <div className="business-profile-counter">
          <span>{(formik.values[field] || []).length}</span> / {maxSelection}{" "}
          selected
        </div>
      </div>
    );
  };

  return (
    <StepCard
      step={3}
      title="Business Profile"
      description="Help others understand how you collaborate and what you are looking for."
      loading={loading}
      onSave={formik.submitForm}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="business-profile-top">
          {renderGroup(
            "Why People Connect With Me",
            "whyPeopleConnect",
            whyPeopleConnectOptions,
            6,
          )}

          {renderGroup("Interested In", "interestedIn", interestedInOptions, 6)}
        </div>

        <div className="business-profile-section-title">
          Verified Association & Network Memberships
        </div>

        {renderGroup(
          "Our company is a member of the following associations:",
          "memberships",
          membershipOptions,
          6,
        )}
      </form>
    </StepCard>
  );
}
