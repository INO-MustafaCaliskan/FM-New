"use client";

import "./business-statistics.css";

import React, { useMemo, useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";

import client from "@/utils/client";
import StepCard from "../StepCard/StepCard";
import StatisticCard from "@/components/ProfileEdit/BusinessStatistics/StatisticCard";

export default function BusinessStatistics({ businessStatistics, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const initial = useMemo(() => {
    const values = {
      seaFreight: "",
      airFreight: "",
      roadFreight: "",
      railFreight: "",
      exportBusiness: "",
      importBusiness: "",
      partners: "",
      ownCustomers: "",
    };

    if (businessStatistics) {
      const bs = businessStatistics;
      values.seaFreight = bs.seaFreightPercentage ?? "";
      values.airFreight = bs.airFreightPercentage ?? "";
      values.roadFreight = bs.roadFreightPercentage ?? "";
      values.railFreight = bs.railFreightPercentage ?? "";
      values.exportBusiness = bs.exportPercentage ?? "";
      values.importBusiness = bs.importPercentage ?? "";
      values.partners = bs.partnersPercentage ?? "";
      values.ownCustomers = bs.ownCustomersPercentage ?? "";
    }

    return values;
  }, [businessStatistics]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initial,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const response = await client.post("/UserDetail/UpdateBusinessStatistics", {
          seaFreightPercentage: Number(values.seaFreight || 0),
          airFreightPercentage: Number(values.airFreight || 0),
          roadFreightPercentage: Number(values.roadFreight || 0),
          railFreightPercentage: Number(values.railFreight || 0),
          exportPercentage: Number(values.exportBusiness || 0),
          importPercentage: Number(values.importBusiness || 0),
          partnersPercentage: Number(values.partners || 0),
          ownCustomersPercentage: Number(values.ownCustomers || 0),
        });

        if (response.data?.success) {
          onUpdate?.(response.data?.data);
          toast.success("Business statistics updated.");
        } else {
          toast.error("Save failed.");
        }
      } catch (error) {
        console.error("Business statistics update failed", error);
        toast.error("Save failed.");
      } finally {
        setLoading(false);
      }
    },
  });

  const isEmptyGroup = (fields) =>
    fields.every((key) => {
      const value = formik.values[key];
      return value === "" || value === null || value === undefined;
    });
  const modeFields = ["seaFreight", "airFreight", "roadFreight", "railFreight"];

  const isModeEmpty = isEmptyGroup(modeFields);

  const modeChartData = isModeEmpty
    ? [100]
    : modeFields.map((key) => Number(formik.values[key] || 0));

  const modeColors = isModeEmpty
    ? ["#e5e7eb"]
    : ["#f97316", "#facc15", "#22c55e", "#3b82f6"];

  const businessFields = ["exportBusiness", "importBusiness"];

  const isBusinessEmpty = isEmptyGroup(businessFields);

  const businessChartData = isBusinessEmpty
    ? [100]
    : businessFields.map((k) => Number(formik.values[k] || 0));

  const businessColors = isBusinessEmpty ? ["#e5e7eb"] : ["#f97316", "#2563eb"];

  const sourceFields = ["partners", "ownCustomers"];

  const isSourceEmpty = isEmptyGroup(sourceFields);

  const sourceChartData = isSourceEmpty
    ? [100]
    : sourceFields.map((k) => Number(formik.values[k] || 0));

  const sourceColors = isSourceEmpty ? ["#e5e7eb"] : ["#f97316", "#2563eb"];

  // ===========================
  // Percentage of Modes
  // ===========================

  const handleGroupChange = (field, value, fields) => {
    const number = value === "" ? "" : Number(value);

    if (number !== "" && (Number.isNaN(number) || number < 0 || number > 100)) {
      return;
    }

    if (fields.length === 2) {
      const otherField = fields.find((key) => key !== field);
      const updates = {
        ...formik.values,
        [field]: number,
      };

      if (number === "") {
        updates[otherField] = "";
      } else {
        updates[otherField] = 100 - number;
      }

      formik.setValues(updates);
      return;
    }

    const values = {
      ...formik.values,
      [field]: number,
    };

    const total = fields.reduce((sum, key) => {
      return sum + (Number(values[key]) || 0);
    }, 0);

    if (total > 100) {
      const totalWithoutCurrentField = fields.reduce((sum, key) => {
        if (key === field) return sum;
        return sum + (Number(formik.values[key]) || 0);
      }, 0);
      const maxAllowed = Math.max(0, 100 - totalWithoutCurrentField);
      toast.warning(`Cannot exceed 100%. You can enter at most ${maxAllowed}% here.`);
      return;
    }

    formik.setValues(values);
  };

  return (
    <StepCard
      step={5}
      title="Business Statistics"
      description="Share your company's operational statistics."
      loading={loading}
      onSave={formik.submitForm}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="statistic-grid">
          <StatisticCard
            title="Percentage of Modes"
            twoColumnInputs={true}
            chartData={modeChartData}
            labels={
              isModeEmpty
                ? ["No Data"]
                : ["Sea Freight", "Air Freight", "Road Freight", "Rail Freight"]
            }
            colors={modeColors}
            inputs={[
              {
                label: "Sea Freight",
                value: formik.values.seaFreight,
                onChange: (e) =>
                  handleGroupChange("seaFreight", e.target.value, [
                    "seaFreight",
                    "airFreight",
                    "roadFreight",
                    "railFreight",
                  ]),
              },
              {
                label: "Air Freight",
                value: formik.values.airFreight,
                onChange: (e) =>
                  handleGroupChange("airFreight", e.target.value, [
                    "seaFreight",
                    "airFreight",
                    "roadFreight",
                    "railFreight",
                  ]),
              },
              {
                label: "Road Freight",
                value: formik.values.roadFreight,
                onChange: (e) =>
                  handleGroupChange("roadFreight", e.target.value, [
                    "seaFreight",
                    "airFreight",
                    "roadFreight",
                    "railFreight",
                  ]),
              },
              {
                label: "Rail Freight",
                value: formik.values.railFreight,
                onChange: (e) =>
                  handleGroupChange("railFreight", e.target.value, [
                    "seaFreight",
                    "airFreight",
                    "roadFreight",
                    "railFreight",
                  ]),
              },
            ]}
          />

          <StatisticCard
            title="Percentage of Business"
            chartData={businessChartData}
            labels={
              isBusinessEmpty
                ? ["No Data"]
                : ["Export Business", "Import Business"]
            }
            colors={businessColors}
            inputs={[
              {
                label: "Export Business",
                value: formik.values.exportBusiness,
                onChange: (e) =>
                  handleGroupChange("exportBusiness", e.target.value, [
                    "exportBusiness",
                    "importBusiness",
                  ]),
              },
              {
                label: "Import Business",
                value: formik.values.importBusiness,
                onChange: (e) =>
                  handleGroupChange("importBusiness", e.target.value, [
                    "exportBusiness",
                    "importBusiness",
                  ]),
              },
            ]}
          />

          <StatisticCard
            title="Source of Business"
            chartData={sourceChartData}
            labels={isSourceEmpty ? ["No Data"] : ["Partners", "Own Customers"]}
            colors={sourceColors}
            inputs={[
              {
                label: "Partners",
                value: formik.values.partners,
                onChange: (e) =>
                  handleGroupChange("partners", e.target.value, [
                    "partners",
                    "ownCustomers",
                  ]),
              },
              {
                label: "Own Customers",
                value: formik.values.ownCustomers,
                onChange: (e) =>
                  handleGroupChange("ownCustomers", e.target.value, [
                    "partners",
                    "ownCustomers",
                  ]),
              },
            ]}
          />
        </div>
      </form>
    </StepCard>
  );
}