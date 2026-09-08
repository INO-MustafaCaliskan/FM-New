"use client";
import React, { useState } from "react";
import Link from "next/link";
import client from "@/utils/client";
import { Spinner, FormControl, Form } from "react-bootstrap";
import * as Yup from "yup";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import "./ForgetPassword.css";
import ConfirmationModal from "../InoModals/ConfirmationModal";
import PasswordChange from "./PasswordChange";
import { toast } from "react-toastify";
import { SendForgetPasswordEmail, SubmitForgetPasswordConfirmation } from "@/utils/authActions";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
});

const ForgetPassword = () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmationId, setConfirmationId] = useState(null);
  const [email, setEmail] = useState("");

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);

    const emailSendResult = await SendForgetPasswordEmail(values.email)
    if(emailSendResult.success){
      toast.success("Success! Please check your email.");
      setEmail(values.email); 
      setShowConfirmationModal(true);
    }else{
      toast.error(emailSendResult.message);
    }

    setLoading(false);
    setSubmitting(false);
  };

  const handleConfirmationSubmit = async () => {
    setIsConfirming(true);

    const codeResult = await SubmitForgetPasswordConfirmation(email, confirmationCode);
    if(codeResult.success){
      setConfirmationId(codeResult.data);
      setShowConfirmationModal(false);
      setShowPasswordChange(true);
      toast.success("Your code has been successfully confirmed.")
    }else{
      toast.error(codeResult.message);
    }

    setIsConfirming(false);
  };

  const handleCloseConfirmationModal = () => setShowConfirmationModal(false);

  return (
    <>
      {!showPasswordChange ? (
        <div className="login__form">
          <div className="login__form-wrapper">
            <div className="login__tab">
              <Link href="#" className="login__tab-link active" style={{ width: 600 }}>
                Reset your password
              </Link>
            </div>
            <Formik
              initialValues={{ email: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              validateOnBlur={false}
            >
              {({ isSubmitting }) => (
                <FormikForm className="form form needs-validation">
                  <div className="form-row">
                    <div className="form-group forget-password-input">
                      <label className="form-label">E-Mail</label>
                      <Field
                        as={FormControl}
                        className="talk-form-control"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email address"
                      />
                      <ErrorMessage name="email" component="div" className="text-danger mt-1" />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group form-group--full">
                      <button
                        id="forget-password-button"
                        type="submit"
                        className="button button-primary"
                        disabled={loading || isSubmitting}
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
                            SEND
                          </>
                        ) : (
                          "SEND"
                        )}
                      </button>
                    </div>
                  </div>
                </FormikForm>
              )}
            </Formik>
          </div>
        </div>
      ) : (
        <PasswordChange
          confirmationId={confirmationId}
          onComplete={() => setShowPasswordChange(false)}
        />
      )}

      <ConfirmationModal
        showModal={showConfirmationModal}
        handleClose={handleCloseConfirmationModal}
        handleSubmit={handleConfirmationSubmit}
        confirmationCode={confirmationCode}
        setConfirmationCode={setConfirmationCode}
        loading={isConfirming}
      />
    </>
  );
};

export default ForgetPassword;
