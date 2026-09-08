"use client";

import "./services-expertise.css";

import React, { useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import { useFormik } from "formik";
import { toast } from "react-toastify";

import client from "@/utils/client";
import StepCard from "../StepCard/StepCard";

import {
  FaTruck,
  FaTrain,
  FaShip,
  FaPlane,
  FaBoxes,
  FaBox,
} from "react-icons/fa";
import {
  FaRoute,
  FaTruckFast,
  FaCapsules,
  FaTemperatureLow,
  FaAppleWhole,
  FaTriangleExclamation,
  FaFlask,
  FaPaw,
  FaCar,
  FaAnchor,
  FaWeightHanging,
  FaCalendarDays,
  FaStamp,
  FaLayerGroup,
  FaWarehouse,
  FaClock,
  FaTruckMoving,
  FaDiagramProject,
  FaCartShopping,
  FaRightLeft,
  FaPeopleGroup,
  FaCertificate,
  FaGears,
} from "react-icons/fa6";

const groups = [
  {
    title: "Transport Modes",
    subtitle: "Multiple transport options to move your cargo globally.",
    colorClass: "group-transport",
    headerIcon: <FaTruckFast />,
    services: [
      { id: "road_freight", label: "Road Freight", apiKey: "roadFreightService", icon: <FaTruck /> },
      { id: "rail_freight", label: "Rail Freight", apiKey: "railFreightService", icon: <FaTrain /> },
      { id: "sea_freight", label: "Sea Freight", apiKey: "seaFreightService", icon: <FaShip /> },
      { id: "air_freight", label: "Air Freight", apiKey: "airFreightService", icon: <FaPlane /> },
      { id: "multimodal_transport", label: "Multimodal Transport", apiKey: "multimodalTransport", icon: <FaRoute /> },
      { id: "fcl_services", label: "FCL Services", apiKey: "fclServices", icon: <FaBoxes /> },
      { id: "lcl_services", label: "LCL Services", apiKey: "lclServices", icon: <FaBox /> },
    ],
  },
  {
    title: "Specialized Solutions",
    subtitle: "Industry-focused expertise for your unique cargo requirements.",
    colorClass: "group-specialized",
    headerIcon: <FaCertificate />,
    services: [
      { id: "pharma", label: "Pharma", apiKey: "pharma", icon: <FaCapsules /> },
      { id: "cold_chain", label: "Cold Chain", apiKey: "coldChain", icon: <FaTemperatureLow /> },
      { id: "perishables", label: "Perishables", apiKey: "perishables", icon: <FaAppleWhole /> },
      { id: "dangerous_goods", label: "Dangerous Goods", apiKey: "dangerousGoods", icon: <FaTriangleExclamation /> },
      { id: "chemicals", label: "Chemicals", apiKey: "chemicals", icon: <FaFlask /> },
      { id: "live_animals", label: "Live Animals", apiKey: "liveAnimals", icon: <FaPaw /> },
      { id: "automotive_logistics", label: "Automotive Logistics", apiKey: "automotiveLogistics", icon: <FaCar /> },
      { id: "marine_logistics", label: "Marine Logistics", apiKey: "marineLogistics", icon: <FaAnchor /> },
      { id: "project_cargo_heavy_lift", label: "Project Cargo / Heavy Lift", apiKey: "projectCargoHeavyLift", icon: <FaWeightHanging /> },
      { id: "exhibition_events_logistics", label: "Exhibition & Events Logistics", apiKey: "exhibitionEventsLogistics", icon: <FaCalendarDays /> },
    ],
  },
  {
    title: "Service Types",
    subtitle: "End-to-end services to streamline your logistics operations.",
    colorClass: "group-service",
    headerIcon: <FaGears />,
    services: [
      { id: "customs_clearance", label: "Customs Clearance", apiKey: "customsClearance", icon: <FaStamp /> },
      { id: "integrated_logistics", label: "Integrated Logistics", apiKey: "integratedLogistics", icon: <FaLayerGroup /> },
      { id: "warehousing", label: "Warehousing", apiKey: "warehousing", icon: <FaWarehouse /> },
      { id: "time_critical", label: "Time Critical", apiKey: "timeCritical", icon: <FaClock /> },
      { id: "relocations", label: "Relocations", apiKey: "relocations", icon: <FaTruckMoving /> },
      { id: "project_logistics", label: "Project Logistics", apiKey: "projectLogistics", icon: <FaDiagramProject /> },
      { id: "ecommerce_logistics", label: "E-commerce Logistics", apiKey: "eCommerceLogisticsService", icon: <FaCartShopping /> },
      { id: "cross_trade", label: "Cross Trade", apiKey: "crossTrade", icon: <FaRightLeft /> },
      { id: "buyer_consolidation", label: "Buyer Consolidation", apiKey: "buyerConsolidation", icon: <FaPeopleGroup /> },
    ],
  },
];

/* Flat list of all services for quick lookups */
const allServices = groups.flatMap((g) => g.services);

export default function ServicesExpertise({ servicesAndExpertise, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const initialValues = useMemo(() => {
    const svc = servicesAndExpertise || {};
    const selected = {};
    allServices.forEach((s) => {
      selected[s.id] = !!svc[s.apiKey];
    });
    return selected;
  }, [servicesAndExpertise]);

  const buildPayload = (values) => {
    const payload = {};
    allServices.forEach((s) => {
      payload[s.apiKey] = !!values[s.id];
    });
    return payload;
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const response = await client.post(
          "/UserDetail/UpdateServicesAndExpertise",
          buildPayload(values),
        );

        if (response.data?.success) {
          onUpdate?.(response.data?.data);
          toast.success("Services updated.");
        } else {
          toast.error("Save failed.");
        }
      } catch (error) {
        console.error("Services update failed", error);
        toast.error("Save failed.");
      } finally {
        setLoading(false);
      }
    },
  });

  const toggle = (id) => {
    formik.setFieldValue(id, !formik.values[id]);
  };

  return (
    <StepCard
      step={4}
      title="Services & Expertise"
      description="Select the services and transport modes your company provides."
      loading={loading}
      onSave={formik.submitForm}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="services-grid">
          {groups.map((group) => (
            <div className={`service-column ${group.colorClass}`} key={group.title}>
              {/* ── Group Header ── */}
              <div className="service-column-header">
                <span className="service-column-header-icon">
                  {group.headerIcon}
                </span>
                <div className="service-column-header-text">
                  <h3 className="service-column-title">{group.title}</h3>
                  <p className="service-column-subtitle">{group.subtitle}</p>
                </div>
              </div>

              {/* ── Service Items ── */}
              <div className="service-column-items">
                {group.services.map((item) => (
                  <Form.Check
                    key={item.id}
                    type="checkbox"
                    id={`svc-${item.id}`}
                    checked={!!formik.values[item.id]}
                    onChange={() => toggle(item.id)}
                    label={
                      <span className="service-label">
                        <span className="service-icon">{item.icon}</span>
                        {item.label}
                      </span>
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </form>
    </StepCard>
  );
}