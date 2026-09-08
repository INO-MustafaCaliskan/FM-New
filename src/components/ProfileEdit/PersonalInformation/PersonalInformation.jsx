"use client";

import "./personal-information.css";
import React, { useEffect, useState } from "react";
import { FiExternalLink, FiLink } from "react-icons/fi";
import { useRouter } from "next/navigation";
import moment from "moment-timezone";
import { Form, FormControl, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import client from "@/utils/client";
import { useUser } from "@/context/UserContext";
import { PhoneNumberSelect } from "@/components/UI/PhoneNumberSelect";
import { CountrySelect } from "@/components/UI/CountrySelect";
import { TimeZoneSelect } from "@/components/UI/TimeZoneSelect";
import { UploadImage } from "@/components/AccountSettings/UploadImage";
import { InoSelect } from "@/components/UI/InoSelect";
import { getCategories, getCities, getJobTitles } from "@/utils/apiActions";
import { MyDetailFormScheme } from "@/validation/ValidationSchemes";
import StepCard from "../StepCard/StepCard";

export default function PersonalInformation({ personalInformation,onUpdate }) {
  const { user } = useUser();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [cities, setCities] = useState([]);

  const [slug, setSlug] = useState("");

  const [myDetails, setMyDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    mobileNumberCountryCode: "",
    mobileNumberCountryIso: "tr",
    birthday: "",
    biography: "",
    categoryId: "",
    cityId: "",
    countryId: "",
    timeZone: "",
    jobTitleId: "",
    imageUrl: "",
  });

  useEffect(() => {
    loadStaticData();
  }, []);

  useEffect(() => {
    if (personalInformation) {
      const data = personalInformation;
      setMyDetails({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || user?.email || "",
        mobileNumber: data.mobileNumber || "",
        mobileNumberCountryCode: data.mobileNumberCountryCode || "",
        mobileNumberCountryIso: data.mobileNumberCountryIso || "tr",
        birthday: data.birthday
          ? moment(data.birthday).format("YYYY-MM-DD")
          : "",
        biography: data.biography || "",
        categoryId: data.categoryId || "",
        cityId: data.cityId || "",
        countryId: data.countryId || "",
        timeZone: data.timeZone || "",
        jobTitleId: data.jobTitleId || "",
        imageUrl: data.imageUrl || "",
      });

      const initialSlug = user?.slug || "";
      setSlug(initialSlug);

      if (data.countryId) {
        loadCities(data.countryId);
      }
    }
  }, [personalInformation]);

  const loadStaticData = async () => {
    try {
      const [categoryResult, jobTitleResult] = await Promise.all([
        getCategories(),
        getJobTitles(),
      ]);

      setCategories(
        categoryResult.map((item) => ({
          value: item.id,
          label: item.name,
        })),
      );

      setJobTitles(
        jobTitleResult.map((item) => ({
          value: item.id,
          label: item.name,
        })),
      );
    } catch (err) {
      console.log(err);
      toast.error("Failed to load static personal information lists.");
    }
  };

  const loadCities = async (countryId) => {
    try {
      const result = await getCities(countryId);

      setCities(
        result.map((item) => ({
          value: item.id,
          label: item.name,
        })),
      );
    } catch (err) {
      console.log(err);
      toast.error("Failed to load cities.");
    }
  };

  const updateProfileImage = async (imageUrl) => {
    try {
      await client.post("/User/UpdateLoginUserProfilePhoto", {
        imageUrl,
      });

      setMyDetails((prev) => ({ ...prev, imageUrl }));
    } catch {
      console.error("Image upload failed.");
    }
  };

  const formik = useFormik({
    enableReinitialize: true,

    validateOnBlur: true,

    validateOnChange: true,

    validationSchema: MyDetailFormScheme,

    initialValues: {
      firstName: myDetails.firstName,
      lastName: myDetails.lastName,
      email: myDetails.email,
      mobileNumber: myDetails.mobileNumber,
      mobileNumberCountryCode: myDetails.mobileNumberCountryCode,
      mobileNumberCountryIso: myDetails.mobileNumberCountryIso,
      birthday: myDetails.birthday,
      biography: myDetails.biography,
      categoryId: myDetails.categoryId,
      cityId: myDetails.cityId,
      countryId: myDetails.countryId,
      timeZone: myDetails.timeZone,
      jobTitleId: myDetails.jobTitleId,
    },

    onSubmit: async (values) => {
      try {
        setLoading(true);

        const response = await client.post("/User/UpdateUserPersonalInformation", {
          ...values,
          imageUrl: myDetails.imageUrl || "",
        });
      
        if (response.data?.success) {
          const responseData = response.data.data;
          onUpdate?.(responseData);

          toast.success("Personal information updated successfully.");
          
          if (values.categoryId !== myDetails.categoryId) {
            window.location.reload();
          }
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
      step={1}
      title="Personal Information"
      description="Complete your personal information."
      loading={loading}
      onSave={formik.submitForm}
    >
      <form
        onSubmit={formik.handleSubmit}
        className="profile-edit-personal-information"
      >
        <div className="profile-edit-form-row profile-edit-row-photo">
          <div className="profile-edit-upload">
            <UploadImage
              defaultImageUrl={myDetails.imageUrl}
              uploadType="profileImage"
              uploadCallback={updateProfileImage}
              variant="avatar"
            />
          </div>

          <div className="profile-edit-info-grid">
            <div className="form-group margin-bottom">
              <Form.Label>
                First Name <span className="profile-edit-required">*</span>
              </Form.Label>

              <FormControl
                className="talk-form-control"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={Boolean(formik.touched.firstName && formik.errors.firstName)}
              />

              {renderError("firstName")}
            </div>

            <div className="form-group margin-bottom">
              <Form.Label>
                Last Name <span className="profile-edit-required">*</span>
              </Form.Label>

              <FormControl
                className="talk-form-control"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={Boolean(formik.touched.lastName && formik.errors.lastName)}
              />

              {renderError("lastName")}
            </div>

            <div className="form-group margin-bottom">
              <InoSelect
                label="Job Title "
                options={jobTitles}
                value={jobTitles.find(
                  (x) => x.value === formik.values.jobTitleId,
                )}
                onChange={(option) => {
                  formik.setFieldValue("jobTitleId", option.value);
                  formik.setFieldTouched("jobTitleId", true);
                }}
                onBlur={() => formik.setFieldTouched("jobTitleId", true)}
                isInvalid={Boolean(formik.touched.jobTitleId && formik.errors.jobTitleId)}
              />
            
            </div>

            <div className="form-group margin-bottom">
              <Form.Label>
                Email <span className="profile-edit-required">*</span>
              </Form.Label>

              <FormControl
                disabled
                value={formik.values.email || user?.email || ""}
                className="talk-form-control"
              />
              {renderError("email")}
            </div>

            <div className="form-group">
              <Form.Label className="form-label">
                Mobile Number 
              </Form.Label>
              <PhoneNumberSelect
                phoneCodeName="mobileNumberCountryCode"
                phoneNumberName="mobileNumber"
                phoneCodeValue={formik.values.mobileNumberCountryCode}
                phoneIsoValue={formik.values.mobileNumberCountryIso}
                phoneNumberValue={formik.values.mobileNumber}
                onPhoneCodeChange={(code, iso) => {
                  formik.setFieldValue("mobileNumberCountryCode", code);
                  formik.setFieldValue("mobileNumberCountryIso", iso);
                  formik.setFieldValue("mobileNumber", "");
                  formik.setFieldTouched("mobileNumberCountryCode", true);
                }}
                onPhoneNumberChange={(value) => {
                  formik.setFieldValue("mobileNumber", value);
                  formik.setFieldTouched("mobileNumber", true);
                }}
                onBlur={() => {
                  formik.setFieldTouched("mobileNumber", true);
                  formik.setFieldTouched("mobileNumberCountryCode", true);
                }}
                isInvalid={Boolean(
                  (formik.touched.mobileNumber || formik.touched.mobileNumberCountryCode) &&
                    (formik.errors.mobileNumber || formik.errors.mobileNumberCountryCode)
                )}
              />
       
            </div>

            <div className="form-group">
              <Form.Label>
                Birthday 
              </Form.Label>

              <FormControl
                type="date"
                className="talk-form-control"
                name="birthday"
                value={formik.values.birthday}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={Boolean(formik.touched.birthday && formik.errors.birthday)}
              />
              
            </div>
          </div>
        </div>

        {/* Row 2: Category / Industry alone (Birthday moved up) */}
        <div className="profile-edit-form-row profile-edit-row-two mt-4">
          <div className="form-group">
            <InoSelect
              label="Category / Industry "
              options={categories}
              value={categories.find(
                (x) => x.value === formik.values.categoryId,
              )}
              onChange={(option) => {
                formik.setFieldValue("categoryId", option.value);
                formik.setFieldTouched("categoryId", true);
              }}
              onBlur={() => formik.setFieldTouched("categoryId", true)}
              isInvalid={Boolean(formik.touched.categoryId && formik.errors.categoryId)}
            />
           
          </div>
          <div className="form-group">
            <TimeZoneSelect
              label="Time Zone "
              value={formik.values.timeZone}
              onChange={(option) => {
                formik.setFieldValue("timeZone", option.value);
                formik.setFieldTouched("timeZone", true);
              }}
              onBlur={() => formik.setFieldTouched("timeZone", true)}
              isInvalid={Boolean(formik.touched.timeZone && formik.errors.timeZone)}
            />
           
          </div>
        </div>

        {/* Row 4: Country, City, Time Zone */}
        <div className="profile-edit-form-row profile-edit-row-three">
          <div className="form-group">
            <CountrySelect
              label="Country"
              value={formik.values.countryId}
              onChange={async (option) => {
                formik.setFieldValue("countryId", option.value);
                formik.setFieldValue("cityId", "");
                formik.setFieldTouched("countryId", true);

                await loadCities(option.value);
              }}
              onBlur={() => formik.setFieldTouched("countryId", true)}
              isInvalid={Boolean(formik.touched.countryId && formik.errors.countryId)}
            />
           
          </div>

          <div className="form-group">
            <InoSelect
              label="City"
              options={cities}
              value={cities.find((x) => x.value === formik.values.cityId)}
              onChange={(option) => {
                formik.setFieldValue("cityId", option.value);
                formik.setFieldTouched("cityId", true);
              }}
              onBlur={() => formik.setFieldTouched("cityId", true)}
              isInvalid={Boolean(formik.touched.cityId && formik.errors.cityId)}
            />
         
          </div>
        </div>

        {/* Row 5: Biography */}
        <div className="profile-edit-form-row profile-edit-row-full">
          <div className="form-group-full mb-4">
            <Form.Label>
              Biography 
            </Form.Label>

            <FormControl
              as="textarea"
              rows={4}
              className="form-control form-textarea"
              name="biography"
              value={formik.values.biography}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              maxLength={1000}
              isInvalid={Boolean(formik.touched.biography && formik.errors.biography)}
            />

            <div className="profile-edit-biography-count">
              {formik.values.biography.length}/1000
            </div>
            {renderError("biography")}
          </div>
        </div>

        {/* Slug / Profile URL — compact display */}
        <div className="pi-slug-card">
          <div className="pi-slug-icon">
            <FiLink size={22} />
          </div>

          <div className="pi-slug-content">
            <p className="pi-slug-desc">
              Your profile has a unique public URL that makes it easy to share and find online.
              It is automatically generated from your name and can be customized to reflect your
              professional identity.
              <span className="pi-slug-inline-url">
                <span className="pi-slug-base"> freighttalk.com/user-profile/</span>
                <span className="pi-slug-slug">{slug || "—"}</span>
                <span className="pi-slug-base">/</span>
              </span>
            </p>
          </div>

          <div className="pi-slug-actions">
            <button
              type="button"
              className="pi-slug-cta"
              onClick={() => router.push("/account-settings?tab=advanced-settings")}
            >
              <FiExternalLink size={13} />
              Customize
            </button>
          </div>
        </div>
      </form>
    </StepCard>
  );
}
