"use client";

import "./company-information.css";

import React, { useEffect, useState } from "react";
import { Form, FormControl } from "react-bootstrap";
import { useFormik } from "formik";
import { toast } from "react-toastify";

import client from "@/utils/client";
import { LuCalendar } from "react-icons/lu";
import StepCard from "../StepCard/StepCard";
import { UploadImage } from "@/components/AccountSettings/UploadImage";
import { InoSelect } from "@/components/UI/InoSelect";
import { CountrySelect } from "@/components/UI/CountrySelect";
import { MyCompanyFormScheme } from "@/validation/ValidationSchemes";

export default function CompanyInformation({ companyInformation, onUpdate }) {

  const [loading, setLoading] = useState(false);

  const [myCompany, setMyCompany] = useState({
    imageUrl: "",
    companyName: "",
    website: "",
    companyIntroduction: "",
    companySize: "",
    foundedYear: "",
    headOfficeCountryId: "",
  });

  const companySizeOptions = [
    { value: "1-20", label: "1-20 Employees" },
    { value: "21-50", label: "21-50 Employees" },
    { value: "51-200", label: "51-200 Employees" },
    { value: "200+", label: "200+ Employees" },
  ];

  useEffect(() => {
    if (companyInformation) {
      const c = companyInformation;
      setMyCompany({
        imageUrl: c.imageUrl || "",
        companyName: c.name || "",
        website: c.website || "",
        companyIntroduction: c.introduction || "",
        companySize: c.size || "",
        foundedYear: c.foundedYear || null,
        headOfficeCountryId: c.headOfficeCountryId || "",
      });
    }
  }, [companyInformation]);

  const updateLogo = async (imageUrl) => {
    try {
      await client.post("/Company/UpdateCompanyLogoForLoginUser", { imageUrl });

      setMyCompany((prev) => ({ ...prev, imageUrl }));
    } catch {
      console.error("Logo update failed.");
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema: MyCompanyFormScheme,

    initialValues: {
      companyName: myCompany.companyName || "",
      website: myCompany.website || "",
      companyIntroduction: myCompany.companyIntroduction || "",
      companySize: myCompany.companySize || "",
      foundedYear: myCompany.foundedYear || undefined,
      headOfficeCountryId: myCompany.headOfficeCountryId || "",
    },

    onSubmit: async (values) => {
      try {
        setLoading(true);


        const response = await client.post(
          "/Company/UpdateCompanyInformation",
          {
            companyId: companyInformation.id,
            name: values.companyName,
            website: values.website,
            imageUrl: myCompany.imageUrl,
            introduction: values.companyIntroduction,
            size: values.companySize,
            foundedYear: values.foundedYear ? Number(values.foundedYear) : null,
            headOfficeCountryId: values.headOfficeCountryId || null,
          },
        );

        if (response.data?.success) {
          onUpdate?.(response.data.data);

          toast.success("Company information updated.");
        } else {
          toast.error("Save failed.");
        }
      } catch {
        toast.error("Save failed.");
      } finally {
        setLoading(false);
      }
    },
  });

  const renderError = (field) => {
    if (!formik.touched[field] || !formik.errors[field]) return null;

    return <div className="profile-edit-field-error">{formik.errors[field]}</div>;
  };

  return (
    <StepCard
      step={2}
      title="Company Information"
      description="Tell us about your company."
      loading={loading}
      onSave={formik.submitForm}
    >
      <form className="company-information-form" onSubmit={formik.handleSubmit}>
        <div className="company-form-row company-row-top">
          <div className="profile-edit-upload">
            <UploadImage
              defaultImageUrl={myCompany.imageUrl}
              uploadType="companyImage"
              uploadCallback={updateLogo}
              variant="avatar"
              label="Company Logo"
            />
          </div>

          <div className="company-grid ">
            <div className="form-group">
              <Form.Label>
                Company Name 
              </Form.Label>
              <FormControl
                name="companyName"
                value={formik.values.companyName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={Boolean(formik.touched.companyName && formik.errors.companyName)}
                className="talk-form-control"
              />
              {renderError("companyName")}
            </div>

            <div className="form-group">
              <Form.Label>
                Website 
              </Form.Label>
              <FormControl
                name="website"
                value={formik.values.website}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={Boolean(formik.touched.website && formik.errors.website)}
                className="talk-form-control"
              />
              {renderError("website")}
            </div>

            <div className="form-group full">
              <Form.Label>
                Company Introduction 
              </Form.Label>
              <FormControl
                as="textarea"
                rows={3}
                name="companyIntroduction"
                value={formik.values.companyIntroduction}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={Boolean(
                  formik.touched.companyIntroduction && formik.errors.companyIntroduction
                )}
                className="form-textarea"
                maxLength={1000}
              />
              <div className="profile-edit-introduction-count">
                {formik.values.companyIntroduction?.length || 0}/1000
              </div>
              
            </div>
          </div>
        </div>

        <div className="company-form-row company-row-two">
          <div>
            <InoSelect
              label="Company Size"
              options={companySizeOptions}
              value={companySizeOptions.find(
                (x) => x.value === formik.values.companySize,
              )}
              onChange={(option) =>
                formik.setFieldValue("companySize", option.value)
              }
            />
          </div>

          <div className="form-group">
            <Form.Label>Founded Year</Form.Label>

            <div className="profile-edit-input-icon-wrapper">
              <FormControl
                type="number"
                placeholder="Founded Year"
                name="foundedYear"
                value={formik.values.foundedYear}
                onChange={formik.handleChange}
                className="talk-form-control input-with-icon"
              />
              <LuCalendar className="profile-edit-input-icon" />
            </div>
          </div>

          <div className="form-group">
            <CountrySelect
              label="Head Office Country"
              value={formik.values.headOfficeCountryId}
              onChange={(option) =>
                formik.setFieldValue("headOfficeCountryId", option?.value || "")
              }
            />
          </div>
        </div>
      </form>
    </StepCard>
  );
}
