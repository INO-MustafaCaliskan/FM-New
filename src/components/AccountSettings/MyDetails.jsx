"use client";
import client from "@/utils/client";
import { FormControl, Spinner } from "react-bootstrap";
import React, { useState, useEffect, useRef } from "react";
import InoLoading from "@/components/InoLoading/InoLoading.jsx";
import moment from "moment-timezone";
import { Form } from "react-bootstrap";
import { Form as BootstrapForm, Button, Image } from "react-bootstrap";
import { IoPersonSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import Link from "next/link";
import "react-tooltip/dist/react-tooltip.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import ProfileModal from "@/components/ProfileModal/ProfileModal.jsx";
import { useUser } from "@/context/UserContext";
import { UploadImage } from "./UploadImage";
import { InoSelect } from "../UI/InoSelect";
import { getJobTitles, getCities, getCategories } from "@/utils/apiActions";
import { PhoneNumberSelect } from "../UI/PhoneNumberSelect";
import { CountrySelect } from "../UI/CountrySelect";
import { TimeZoneSelect } from "../UI/TimeZoneSelect";
import { MyDetailFormScheme } from "@/validation/ValidationSchemes";

export default function MyDetails() {
  const oldData = useRef(null);
  const { user, logout } = useUser();

  
  const [myDetails, setMyDetails] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    mobileNumberCountryCode: "",
    birthday: "",
    timeZone: "",
    biography: "",
    categoryId: "",
    cityId: "",
    countryId: "",
    jobTitleId: "",
  });

  const [categories, setCategories] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [show, setShow] = useState(false);
  const { imageUrl, ...detailsWithoutImage } = myDetails;

  let email = user.email;

  const formik = useFormik({
    initialValues: {
      firstName: myDetails.firstName,
      lastName: myDetails.lastName,
      mobileNumber: myDetails.mobileNumber,
      mobileNumberCountryCode: myDetails.mobileNumberCountryCode,
      mobileNumberCountryIso: myDetails.mobileNumberCountryIso || "tr",
      birthday: myDetails.birthday,
      timeZone: myDetails.timeZone,
      biography: myDetails.biography,
      categoryId: myDetails.categoryId,
      cityId: myDetails.cityId,
      countryId: myDetails.countryId,
      jobTitleId: myDetails.jobTitleId,
    },
    // validationSchema: MyDetailFormScheme,
    onSubmit: async (values) => {
      console.log("Submitting form with values:", values);
      setLoading(true);
      try {
        const response = await client.post(
          "/User/UpdateLoginUserAccountSettings",
          values,
        );
        setLoading(false);
        toast.success(`Saved successfully!`);
      } catch (error) {
        const response = console.error("Error updating user details:", error);
        setLoading(false);
      }
    },
    enableReinitialize: true,
    validateOnChange: false, // Sadece submit edildiğinde validasyon çalışır
    validateOnBlur: false, // Sadece submit edildiğinde validasyon çalışır
  });

  useEffect(() => {
    fetchCategories();
    fetchJobTitles();

    const fetchData = async () => {
      try {
        const response = await client.get("/User/GetLoginUserDetails");
        const responseData = response.data.data;
        const formattedBirthday = moment(responseData.birthday).format(
          "YYYY-MM-DD",
        );
        setMyDetails({
          ...responseData,
          birthday: formattedBirthday,
          mobileNumberCountryIso: responseData.mobileNumberCountryIso || "tr",
        });
        await fetchCities(responseData.countryId);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchData();
  }, []);

  const handleShow = (e) => {
    e.preventDefault();
    setShow(true);
  };
  const handleClose = () => setShow(false);

  const fetchCategories = () => {
    getCategories().then((categories) => {
      setCategories(
        categories.map((category) => {
          return { value: category.id, label: category.name };
        }),
      );
    });
  };

  const fetchJobTitles = () => {
    getJobTitles().then((jobTitles) => {
      setJobTitles(
        jobTitles.map((job) => {
          return { value: job.id, label: job.name };
        }),
      );
    });
  };

  const fetchCities = (countryId) => {
    getCities(countryId).then((cities) => {
      setCities(
        cities.map((city) => ({
          value: city.id,
          label: city.name,
        })),
      );
    });
  };

  const updateUserLogo = async (imageUrl) => {
    try {
      await client.post("/User/UpdateLoginUserProfilePhoto", {
        imageUrl,
      });
    } catch (error) {
      console.error("Error updating company logo:", error);
      toast.error("Error saving image");
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await client.get("/User/DeleteAccount");
        window.location.href = "/sign-out";
        // Optionally, you can log the user out or redirect them to a different page after deletion.
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  }

  if (!user) return <></>;

  if (!myDetails) {
    return <InoLoading />;
  }

  return (
    <>
      <div className="settings__content">
        <form
          className="form needs-validation account-Form"
          encType="multipart/form-data"
          id="accountsettings_main"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <div className="form-row">
            <div className="account-settings-image form-group">
              <UploadImage
                defaultImageUrl={myDetails.imageUrl}
                uploadType="profileImage"
                uploadCallback={updateUserLogo}
              />
            </div>
            <div className="form-group">
              <Form.Label>First Name</Form.Label>
              <FormControl
                type="text"
                className="talk-form-control"
                id="firstName"
                name="firstName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
                isInvalid={
                  formik.touched.firstName && !!formik.errors.firstName
                }
              />
              <BootstrapForm.Control.Feedback type="invalid">
                {formik.errors.firstName}
              </BootstrapForm.Control.Feedback>
            </div>
            <div className="form-group">
              <Form.Label>Last Name</Form.Label>
              <FormControl
                type="text"
                className="talk-form-control"
                id="lastName"
                name="lastName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastName}
                isInvalid={formik.touched.lastName && !!formik.errors.lastName}
              />
              <BootstrapForm.Control.Feedback type="invalid">
                {formik.errors.lastName}
              </BootstrapForm.Control.Feedback>
            </div>
            <div className="form-group position-relative">
              <Form.Label className="form-label">Email</Form.Label>
              <Link
                href={""}
                type="button"
                className="tooltip-btn  d-flex justify-content-center align-items-center"
                data-tooltip-id="my-tooltip"
                data-place="top"
              >
                i
              </Link>
              <Form.Control
                disabled={true}
                type="text"
                id="email"
                name="email"
                value={email}
                data-info="tooltip"
                className="talk-form-control "
              />
              <Tooltip id="my-tooltip" className="custom-tooltip">
                {" "}
                <p>
                  {" "}
                  If you want to change your email address, please get in
                  contact with Customer Service Department.
                </p>
              </Tooltip>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <Form.Label className="form-label">Mobile Number</Form.Label>
              <PhoneNumberSelect
                phoneCodeName="mobileNumberCountryCode"
                phoneNumberName="mobileNumber"
                phoneCodeValue={formik.values.mobileNumberCountryCode}
                phoneIsoValue={formik.values.mobileNumberCountryIso} // ✅ flag gönderiyoruz
                phoneNumberValue={formik.values.mobileNumber}
                onPhoneCodeChange={(code, iso) => {
                  formik.setFieldValue("mobileNumberCountryCode", code);
                  formik.setFieldValue("mobileNumberCountryIso", iso); // ✅ flag kaydediliyor
                  formik.setFieldValue("mobileNumber", "");
                }}
                onPhoneNumberChange={(value) => {
                  formik.setFieldValue("mobileNumber", value);
                }}
                onBlur={formik.handleBlur}
                isInvalid={
                  !!formik.errors.mobileNumberCountryCode ||
                  !!formik.errors.mobileNumber
                }
              />
              <BootstrapForm.Control.Feedback type="invalid">
                {[
                  formik.errors.mobileNumber,
                  formik.errors.mobileNumberCountryCode,
                ].join(" ")}
              </BootstrapForm.Control.Feedback>
            </div>
            <div className="form-group">
              <Form.Label>Birthday</Form.Label>
              <Link
                href={""}
                type="button"
                className="tooltip-btn d-flex justify-content-center align-items-center"
                data-tooltip-id="my-tooltip-2"
                data-place="top"
              >
                i
              </Link>

              <FormControl
                type="date"
                className="talk-form-control date-talk"
                id="birthday"
                name="birthday"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.birthday || ""}
                isInvalid={formik.touched.birthday && !!formik.errors.birthday}
              />
              <BootstrapForm.Control.Feedback type="invalid">
                {formik.errors.birthday}
              </BootstrapForm.Control.Feedback>

              <Tooltip id="my-tooltip-2" className="custom-tooltip">
                <p>
                  We may need your birth date as a security question in case of
                  any trouble. It is suggested to enter this information to
                  recover your account.
                </p>
              </Tooltip>
            </div>
            <div className="form-group">
              <InoSelect
                label="Job Title"
                id="jobTitleId"
                name="jobTitleId"
                options={jobTitles}
                onChange={(option) =>
                  formik.setFieldValue("jobTitleId", option.value)
                }
                onBlur={formik.handleBlur}
                value={jobTitles.find(
                  (option) => option.value === formik.values.jobTitleId,
                )}
                isInvalid={
                  formik.touched.jobTitleId && !!formik.errors.jobTitleId
                }
              />
              <BootstrapForm.Control.Feedback type="invalid">
                {formik.errors.jobTitleId}
              </BootstrapForm.Control.Feedback>
            </div>
            <div className="form-group">
              <InoSelect
                label="Category"
                id="categoryId"
                name="categoryId"
                options={categories}
                onChange={(option) =>
                  formik.setFieldValue("categoryId", option.value)
                }
                onBlur={formik.handleBlur}
                value={categories.find(
                  (option) => option.value === formik.values.categoryId,
                )}
                isInvalid={
                  formik.touched.categoryId && !!formik.errors.categoryId
                }
              />
              <BootstrapForm.Control.Feedback type="invalid">
                {formik.errors.categoryId}
              </BootstrapForm.Control.Feedback>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <TimeZoneSelect
                label="Time Zone"
                name="timeZone"
                value={formik.values.timeZone}
                onChange={(option) =>
                  formik.setFieldValue("timeZone", option.value)
                }
                onBlur={formik.handleBlur}
                isInvalid={formik.errors.timeZone}
              />
              <BootstrapForm.Control.Feedback type="invalid">
                {formik.errors.timeZone}
              </BootstrapForm.Control.Feedback>
            </div>
            <div className="form-group">
              <CountrySelect
                label="Country"
                name="countryId"
                isInvalid={formik.touched.countryId && formik.errors.countryId}
                onChange={async (option) => {
                  formik.setFieldValue("countryId", option.value);
                  formik.setFieldValue("cityId", "");
                  await fetchCities(option.value);
                }}
                value={formik.values.countryId}
                onBlur={formik.handleBlur}
              />
              <BootstrapForm.Control.Feedback type="invalid">
                {formik.errors.countryId}
              </BootstrapForm.Control.Feedback>
            </div>
            <div className="form-group">
              <InoSelect
                label="City"
                id="cityId"
                name="cityId"
                options={cities}
                placeholder="Please select city..."
                onChange={(option) => {
                  formik.setFieldValue("cityId", option.value);
                }}
                onBlur={formik.handleBlur}
                value={
                  cities.find((ct) => ct.value === formik.values.cityId) || ""
                }
                isInvalid={formik.touched.cityId && !!formik.errors.cityId}
              />
              <BootstrapForm.Control.Feedback type="invalid">
                {formik.errors.cityId}
              </BootstrapForm.Control.Feedback>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group form-group--full enter-100 mb-0">
              <Form.Label>Biography</Form.Label>
              <FormControl
                as="textarea"
                rows={5}
                className="form-control form-textarea"
                id="biography"
                name="biography"
                onChange={formik.handleChange}
                value={formik.values.biography}
              />

              <div className="col-md-4 mt-3">
                <div className="total-character-area">
                  Total Characters:{" "}
                  <span className="total-count" data-type="biography">
                    {formik.values.biography?.length || 0}/1000
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="form-row mt-3 company-button">
            <div className="d-flex flex-column flex-md-row gap-2 form-group w-100 justify-content-between mt-1 mt-md-5">
              <div className="col-md-6 d-flex align-items-center">
                <Link
                  href={`/user-profile/${user.slug}`}
                  className="account-settings-profile-btn"
                >

                  <IoPersonSharp className="bi bi-person-fill" />
                  <span>View My Profile</span>
                </Link>

                <ProfileModal
                  show={show}
                  handleClose={handleClose}
                  userId={user?.id}
                />
              </div>
              <div className="col-md-3 text-end">
                <Button
                  type="submit"
                  className="talk-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{" "}
                      Save and Update
                    </>
                  ) : (
                    "Save and Update"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Tooltip id="my-tooltip" />
      {/* <InoButton title="Delete My Account" onClick={handleDeleteAccount} ></InoButton> */}
    </>
  );
}
