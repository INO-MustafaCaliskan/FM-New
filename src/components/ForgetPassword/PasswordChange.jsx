import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Spinner, FormControl } from "react-bootstrap";
import { toast } from "react-toastify";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { ResetPassword } from "@/utils/authActions";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

const PasswordChange = ({ confirmationId, onComplete }) => {
  const [showValidation, setShowValidation] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(8, "Minimum 8 characters")
        .matches(/[a-z]/, "Must contain a lowercase letter")
        .matches(/[A-Z]/, "Must contain an uppercase letter")
        .matches(/[0-9]/, "Must contain a number")
        .required("Password cannot be empty"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required(" Confirm password cannot be empty"),
    }),
    validateOnChange: false, 
    validateOnBlur: false, 
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      if (values.newPassword !== values.confirmPassword) {
        setErrors({ confirmPassword: "Passwords do not match!" });
        setSubmitting(false);
        return;
      }

      const passwordChangeResponse = await ResetPassword(confirmationId, values.newPassword, values.confirmPassword);
      if(passwordChangeResponse.success){
        onComplete();
        const swalRes = await MySwal.fire({
          title : "Password changed successfully",
          text : "Your password has been updated. You can now sign in with your new password.",
          icon : "success",
          showConfirmButton : true,
          confirmButtonText : "Go to Sign In",
          showCancelButton : false,
        })

        if(swalRes.isConfirmed)
          window.location.href = "/sign-in";
      }else{
        toast.error(passwordChangeResponse.message);
      }

      setSubmitting(false);
    },
  });

  return (
    <div className="login__form">
      <div className="login__form-wrapper">
        <div className="login__tab">
          <Link
            href="#"
            className="login__tab-link active"
            style={{ width: 600 }}
          >
            Reset Password
          </Link>
        </div>
        <form
          className="form form needs-validation"
          onSubmit={formik.handleSubmit}
        >
          <div className="password-change-form">
            <div className="form-row">
              <div className="form-group forget-password-input">
                <label className="form-label">New Password</label>
                <FormControl
                  className="talk-form-control"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  {...formik.getFieldProps("newPassword")}
                  onInput={() => setShowValidation(true)}
                  isInvalid={
                     formik.errors.newPassword
                  }
                />
                <div
                  className="icon-wrapper-sign"
                  onClick={toggleNewPasswordVisibility}
                >
                  <FontAwesomeIcon
                    icon={showNewPassword ? faEyeSlash : faEye}
                  />
                </div>
                { formik.errors.newPassword && (
                  <div className="invalid-feedback">
                    {formik.errors.newPassword}
                  </div>
                )}
              </div>
            </div>

            {showValidation && (
              <div
                id="message"
                style={{ display: "block", margin: "0 15px 10px" }}
              >
                <h3>Password must contain the following:</h3>
                <p
                  id="letter"
                  className={
                    /[a-z]/.test(formik.values.newPassword) ? "valid" : ""
                  }
                >
                  A <b>lowercase</b> letter
                </p>
                <p
                  id="capital"
                  className={
                    /[A-Z]/.test(formik.values.newPassword) ? "valid" : ""
                  }
                >
                  A <b>capital (uppercase)</b> letter
                </p>
                <p
                  id="number"
                  className={
                    /[0-9]/.test(formik.values.newPassword) ? "valid" : ""
                  }
                >
                  A <b>number</b>
                </p>
                <p
                  id="length"
                  className={
                    formik.values.newPassword.length >= 8 ? "valid" : ""
                  }
                >
                  Minimum <b>8 characters</b>
                </p>
              </div>
            )}

            <div className="form-row">
              <div className="form-group forget-password-input">
                <label className="form-label">Confirm Password</label>
                <FormControl
                  className="talk-form-control"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  {...formik.getFieldProps("confirmPassword")}
                  isInvalid={
                    formik.errors.confirmPassword
                  }
                />
                <div
                  className="icon-wrapper-sign"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEyeSlash : faEye}
                  />
                </div>
                {
                  formik.errors.confirmPassword && (
                    <div className="invalid-feedback">
                      {formik.errors.confirmPassword}
                    </div>
                  )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group form-group--full">
                <button
                  id="change-password-button"
                  type="submit"
                  className="button button-primary"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{" "}
                      Changing...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChange;
