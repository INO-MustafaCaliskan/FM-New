"use client";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { FormControl, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import client from "@/utils/client";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import InoButton from "../Buttons/InoButton";
import SweetAlert2 from "react-sweetalert2";
import ContentPage from "@/components/ContentPage/ContentPage";
import { PhoneNumberSelect } from "../UI/PhoneNumberSelect";
import { CountrySelect } from "../UI/CountrySelect";
import { ContactUsFormScheme } from "@/validation/ValidationSchemes";
import { Modal, Button } from "react-bootstrap";
import "./contact-us.css";
const ContactUsForm = () => {
  const { user, loading } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      companyName: user?.companyName || "",
      businessEmail: user?.email || "",
      mobileNumberCountryCode: user?.mobileNumberCountryCode || "+90",
      mobileNumberCountryIso: user?.mobileNumberCountryIso || "tr",
      mobileNumber: user?.mobileNumber || "",
      countryId: user?.countryId || "",
      subject: "",
      message: "",
      termsAccepted: false,
    },
    validationSchema: ContactUsFormScheme,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      try {
        await client.post("ContactMessage/Add", values);
        toast.success("Your message has been sent successfully!");
        resetForm();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },
    enableReinitialize: true,
  });

  const onTermsClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };
  const onPrivacyClick = (e) => {
    e.preventDefault();
    setShowPrivacyModal(true);
  };

  if (loading) return null;

  return (
    <>
      <form
        className="row my-3 needs-validation account-form col-md-12"
        noValidate
        id="contactUsForm"
        onSubmit={formik.handleSubmit}
      >
        <div className="col-12 ">
          {/*TITLE/Head*/}
          <div className="row">
            <h2 className="fw-bold">Let's Talk!</h2>
            <p>
              Get in touch with us ising the enquiry form or contact details
              below.
            </p>
          </div>

          <div className="row g-4">
            {/*Name*/}
            <div className="col-12 col-md-6">
              <label htmlFor="contact-us__first-name" className="form-label">
                First Name
              </label>
              <FormControl
                type="text"
                className="form-control"
                placeholder="First Name"
                required
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.firstName && formik.errors.firstName}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.firstName}
              </Form.Control.Feedback>
            </div>
            {/*LastName*/}
            <div className="col-12 col-md-6">
              <label htmlFor="contact-us__last-name" className="form-label">
                Last Name
              </label>
              <FormControl
                type="text"
                className="form-control"
                id="contact-us__last-name"
                placeholder="Last Name"
                required
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.lastName && formik.errors.lastName}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.lastName}
              </Form.Control.Feedback>
            </div>
            {/*Country*/}
            <div className="col-12 col-md-6">
              <CountrySelect
                label={<>Country</>}
                name="countryId"
                value={formik.values.countryId}
                onChange={(selectedOption) =>
                  formik.setFieldValue("countryId", selectedOption?.value || "")
                }
                onBlur={formik.handleBlur}
                isInvalid={formik.errors.countryId}
              />

              <Form.Control.Feedback type="invalid">
                {formik.errors.countryId}
              </Form.Control.Feedback>
            </div>
            {/*Company Name*/}
            <div className="col-12 col-md-6">
              <label htmlFor="contact-us__company-name" className="form-label">
                Company Name
              </label>
              <FormControl
                type="text"
                className="form-control"
                id="contact-us__company-name"
                placeholder="Company Name"
                required
                name="companyName"
                value={formik.values.companyName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.companyName && formik.errors.companyName
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.companyName}
              </Form.Control.Feedback>
            </div>
            {/* Email*/}
            <div className="col-12">
              <label htmlFor="contact-us__mail" className="form-label">
                Business E-mail
              </label>
              <FormControl
                type="email"
                className="form-control"
                id="contact-us__mail"
                placeholder="Business E-mail"
                required
                name="businessEmail"
                value={formik.values.businessEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.businessEmail && formik.errors.businessEmail
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.businessEmail}
              </Form.Control.Feedback>
            </div>
            {/*Mobile Numver*/}
            <div className="col-12 ">
              <label className="form-label">Mobile Number </label>
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
                }}
                onPhoneNumberChange={(value) =>
                  formik.setFieldValue("mobileNumber", value)
                }
                onBlur={formik.handleBlur}
                isInvalid={
                  (formik.touched.mobileNumberCountryCode &&
                    !!formik.errors.mobileNumberCountryCode) ||
                  (formik.touched.mobileNumber && !!formik.errors.mobileNumber)
                }
              />
              <Form.Control.Feedback type="invalid">
                {[formik.errors.phone, formik.errors.mobileNumber].join(" ")}
              </Form.Control.Feedback>
            </div>
            {/*Subject*/}
            <div className="col-12  ">
              <label htmlFor="contact-us__subject" className="form-label">
                Subject
              </label>
              <FormControl
                type="text"
                className="form-control"
                id="contact-us__subject"
                maxLength="250"
                placeholder="Subject"
                required
                name="subject"
                value={formik.values.subject}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.subject && formik.errors.subject}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.subject}
              </Form.Control.Feedback>
            </div>
            {/*Message*/}
            <div className="col-12 col-md-12">
              <label htmlFor="contact-us__message" className="form-label">
                Message
              </label>
              <FormControl
                className="form-control"
                as="textarea"
                id="contact-us__message"
                rows={5}
                placeholder="Message"
                required
                name="message"
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.message && formik.errors.message}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.message}
              </Form.Control.Feedback>
            </div>
            {/*Terms and Conditions Checkbox*/}
            <div className="contact-check-box   col-12 d-flex gap-2 align-items-center">
              <div className="form-check">
                <input
                  type="checkbox"
                  className={`form-check-input ${
                    formik.touched.termsAccepted && formik.errors.termsAccepted
                      ? "is-invalid"
                      : ""
                  }`}
                  id="invalidCheck"
                  name="termsAccepted"
                  checked={formik.values.termsAccepted}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.termsAccepted &&
                  formik.errors.termsAccepted && (
                    <div className="invalid-feedback d-block">
                      {formik.errors.termsAccepted}
                    </div>
                  )}
              </div>
              <div>
                <label
                  htmlFor="invalidCheck"
                  className="form-check-label contactus"
                >
                  I Agree to the{" "}
                  <Link href="#" onClick={onTermsClick}>
                    <u className="terms-link">Terms and Conditions</u>
                  </Link>{" "}
                  and{" "}
                  <Link href="#" onClick={onPrivacyClick}>
                    <u className="terms-link">Privacy Policy </u>
                  </Link>
                </label>
              </div>
            </div>
            {/*Submit Button*/}
            <div className="contact-us-button mt-5 mb-3 d-flex justify-content-start">
              <InoButton
                id="contact-us-button"
                type="submit"
                width={150}
                height={45}
              >
                Submit
              </InoButton>
            </div>
          </div>
        </div>
      </form>
      {/* TERMS AND CONDITIONS MODAL */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        scrollable
        dialogClassName="contact-terms-modal"
      >
        <Modal.Header className="d-flex align-items-center">
          <Modal.Title className="flex-grow-1">
            Terms and Conditions
          </Modal.Title>

          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setShowModal(false)}
          />
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <ContentPage
            payload="TermsAndConditions"
            url="/PublicContent/GetPublicContent/"
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* PRIVACY POLICY MODAL */}
      <Modal
        show={showPrivacyModal}
        onHide={() => setShowPrivacyModal(false)}
        centered
        scrollable
        dialogClassName="contact-terms-modal"
      >
        <Modal.Header className="d-flex align-items-center">
          <Modal.Title className="flex-grow-1">Privacy Policy</Modal.Title>

          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setShowPrivacyModal(false)}
          />
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <ContentPage
            payload="PrivacyPolicy"
            url="/PublicContent/GetPublicContent/"
          />
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPrivacyModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ContactUsForm;
