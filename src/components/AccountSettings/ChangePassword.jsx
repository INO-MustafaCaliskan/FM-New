import React, { useState, useEffect } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import client from "@/utils/client";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as Yup from "yup";
import { ChangePasswordSchema } from "@/validation/ValidationSchemes";

export default function ChangePassword() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showCriteria, setShowCriteria] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    setLoading(true);
    setServerError("");
    try {
      await client.post("/User/UpdateLoginUserPassword", values);
      resetForm();
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setFormKey((prevKey) => prevKey + 1);
      setPasswordChanged(true);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.data) {
        setServerError(error.response.data.message || "An error occurred");
      } else {
        setServerError("An error occurred");
      }
      
      setLoading(false);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (passwordChanged) {
      toast.success("Password change successful!");
      setPasswordChanged(false);
    }
  }, [passwordChanged]);

  return (
    <>
      <div className="change-password settings__content settings__password">
        <Formik
          key={formKey}
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={ChangePasswordSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            isValid,
            resetForm,
          }) => (
            <Form
              className="form needs-validation account-Form"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
            >
              <div className="form-row">
                <div className="form-group">
                  <Form.Label className="form-label">
                    Current Password
                  </Form.Label>
                  <div
                    className="change-password-input"
                    style={{ position: "relative" }}
                  >
                    <Form.Control
                      type={showCurrentPassword ? "text" : "password"}
                      id="current-password"
                      name="currentPassword"
                      value={values.currentPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        touched.currentPassword && errors.currentPassword
                          ? "talk-form-control is-invalid"
                          : "talk-form-control"
                      }
                    />
                    <div
                      className="icon-wrapper"
                      onClick={toggleCurrentPasswordVisibility}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={showCurrentPassword ? faEyeSlash : faEye}
                      />
                    </div>
                    {touched.currentPassword && errors.currentPassword && (
                      <div
                        className="invalid-feedback"
                        style={{
                          position: "absolute",
                          bottom: "-20px",
                          marginTop: "5px",
                        }}
                      >
                        {errors.currentPassword}
                      </div>
                    )}
                  </div>
                  {serverError && (
                    <div className="invalid-feedback d-block">
                      {serverError}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <Form.Label className="form-label">New Password</Form.Label>
                  <div
                    className="change-password-input"
                    style={{ position: "relative" }}
                  >
                    <Form.Control
                      type={showNewPassword ? "text" : "password"}
                      id="new-password"
                      name="newPassword"
                      value={values.newPassword}
                      onChange={handleChange}
                      onBlur={(e) => {
                        handleBlur(e);
                        setShowCriteria(false);
                      }}
                      onFocus={() => setShowCriteria(true)}
                      className={
                        touched.newPassword && errors.newPassword
                          ? "talk-form-control is-invalid"
                          : "talk-form-control"
                      }
                    />
                    <div
                      className="icon-wrapper"
                      onClick={toggleNewPasswordVisibility}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={showNewPassword ? faEyeSlash : faEye}
                      />
                    </div>
                    {touched.newPassword && errors.newPassword && (
                      <div
                        className="invalid-feedback"
                        style={{
                          position: "absolute",
                          bottom: "-20px",
                          marginTop: "5px",
                        }}
                      >
                        {errors.newPassword}
                      </div>
                    )}
                  </div>
                  {showCriteria && (
                    <div  id="message" style={{ display: "block" ,marginTop: 30}}>
                      <h3>Password must contain the following:</h3>
                      <p
                        id="letter"
                        className={
                          /[a-z]/.test(values.newPassword) ? "valid" : ""
                        }
                      >
                        A <b>lowercase</b> letter
                      </p>
                      <p
                        id="capital"
                        className={
                          /[A-Z]/.test(values.newPassword) ? "valid" : ""
                        }
                      >
                        A <b>capital (uppercase)</b> letter
                      </p>
                      <p
                        id="number"
                        className={
                          /[0-9]/.test(values.newPassword) ? "valid" : ""
                        }
                      >
                        A <b>number</b>
                      </p>
                      <p
                        id="length"
                        className={
                          /.{8,}/.test(values.newPassword) ? "valid" : ""
                        }
                      >
                        Minimum <b>8 characters</b>
                      </p>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <Form.Label className="form-label">
                    Confirm Password
                  </Form.Label>
                  <div
                    className="change-password-input"
                    style={{ position: "relative" }}
                  >
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirm-password"
                      name="confirmPassword"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        touched.confirmPassword && errors.confirmPassword
                          ? "talk-form-control is-invalid"
                          : "talk-form-control"
                      }
                    />
                    <div
                      className="icon-wrapper"
                      onClick={toggleConfirmPasswordVisibility}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={showConfirmPassword ? faEyeSlash : faEye}
                      />
                    </div>

                    {values.confirmPassword && (
                      <div
                        className={
                          errors.confirmPassword
                            ? "invalidd text-danger"
                            : "validd text-success"
                        }
                        style={{
                          position: "absolute",
                          bottom: "-20px",
                          marginTop: "5px",
                        }}
                      >
                        {errors.confirmPassword
                          ? errors.confirmPassword
                          : "Passwords match."}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-row d-flex justify-content-end">
                <div>
                  <Button
                    type="submit"
                    className="talk-button"
                    disabled={loading || isSubmitting || !isValid}
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
                        Change Password
                      </>
                    ) : (
                      "Change Password"
                    )}
                    
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}
