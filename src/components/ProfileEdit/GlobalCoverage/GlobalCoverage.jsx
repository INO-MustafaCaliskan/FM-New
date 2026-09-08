"use client";

import "./global-coverage.css";

import React, { useMemo, useState } from "react";
import { Form, FormControl } from "react-bootstrap";
import { useFormik } from "formik";
import { toast } from "react-toastify";

import client from "@/utils/client";
import { CountrySelect } from "@/components/UI/CountrySelect";
import StepCard from "../StepCard/StepCard";

export default function GlobalCoverage({ globalCoverage, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const buildCountryFlagUrl = (country) => {
    if (!country) return "";

    const countryCode = country.countryCode || country.code || country.value || "";
    if (!countryCode) return "";

    const normalized = String(countryCode).trim().toLowerCase();
    if (normalized === "trnc") {
      return "/images/north-cyprus.png";
    }

    return `https://flagcdn.com/w20/${normalized.slice(0, 2)}.png`;
  };

  const initial = useMemo(() => {
    const values = {
      countryCount: "",
      countries: [],
    };

    if (globalCoverage) {
      const gc = globalCoverage;
      values.countryCount = gc.howManyCountriesDoYouServe ?? "";
      values.countries = (gc.top6Markets || []).map((c) => ({
        value: c.id,
        label: c.name,
        countryCode: c.countryCode || c.name,
        flag: c.flag || buildCountryFlagUrl({ countryCode: c.countryCode || c.name }),
      }));
    }

    return values;
  }, [globalCoverage]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initial,

    onSubmit: async (values) => {
      try {
        setLoading(true);

        const response = await client.post("/UserDetail/UpdateGlobalCoverage", {
          howManyCountriesDoYouServe: Number(values.countryCount || 0),
          top6Markets: (values.countries || []).map((country) => ({
            id: country.value,
            name: country.label,
            flag: country.flag || buildCountryFlagUrl(country),
          })),
        });

        if (response.data?.success) {
          onUpdate?.(response.data?.data);
          toast.success("Global coverage updated.");
        } else {
          toast.error("Save failed.");
        }
      } catch (error) {
        console.error("Global coverage update failed", error);
        toast.error("Save failed.");
      } finally {
        setLoading(false);
      }
    },
  });

  const MAX_COUNTRIES = 6;

  const selectedCountries = formik.values.countries;

  const addCountry = (country) => {
    if (
      selectedCountries.length >= MAX_COUNTRIES ||
      selectedCountries.some((c) => c.value === country.value)
    ) {
      return;
    }

    const normalizedCountry = {
      ...country,
      countryCode: country.countryCode || country.code || country.value,
      flag: country.flag || buildCountryFlagUrl(country),
    };

    formik.setFieldValue("countries", [...selectedCountries, normalizedCountry]);
  };

  const removeCountry = (value) => {
    formik.setFieldValue(
      "countries",
      selectedCountries.filter((c) => c.value !== value),
    );
  };

  const isDisabled = selectedCountries.length >= MAX_COUNTRIES;

  return (
    <StepCard
      step={6}
      title="Global Coverage"
      description="How many countries do you serve?"
      loading={loading}
      onSave={formik.submitForm}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="global-covarage-wrapper">
          {/* LEFT */}
          <div className="global-covarage-left">
            <Form.Label>How many countries do you serve?</Form.Label>
            <FormControl
              type="number"
              value={formik.values.countryCount}
              onChange={formik.handleChange}
              name="countryCount"
              className="talk-form-control"
            />
          
          </div>
        

          <div className="global-covarage-right">
            <Form.Label>Top Markets (max 6)</Form.Label>

            <CountrySelect
              key={isDisabled ? "disabled" : "enabled"}
              isDisabled={isDisabled}
              value={null}
              onChange={(option) => {
                if (!option) return;

                const exists = selectedCountries.some(
                  (c) => c.value === option.value,
                );

                if (exists) return;

                if (selectedCountries.length >= 6) return;

                addCountry(option);
              }}
            />
                {isDisabled && (
            <div className="global-coverage-limit">
              Maximum 6 countries can be selected.
            </div>
          )}

            <div className="global-covarage-list">
              {selectedCountries.map((c) => (
                <div key={c.value} className="global-covarage-item">
                  <img
                    src={c.flag || buildCountryFlagUrl(c)}
                    width={20}
                    height={15}
                    alt={c.label}
                    className="global-covarage-flag"
                  />

                  <span className="global-covarage-name">{c.label}</span>

                  <button
                    type="button"
                    className="global-covarage-remove"
                    onClick={() => removeCountry(c.value)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </StepCard>
  );
}