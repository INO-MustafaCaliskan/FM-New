import Link from "next/link";
import React, { useState, useRef, useEffect, useTransition } from "react";
import SocialLoginButton from "./SocialLoginButton";
import { Button, Form, FormControl, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGoogleLogin } from "@react-oauth/google";
import AppleSignin from 'react-apple-signin-auth';
import { useFormik } from "formik";
import client from "@/utils/client";
import { useRouter, useSearchParams } from "next/navigation";
import useToastify from "@/utils/hooks/useToastify";
import { SignupFormScheme } from "@/validation/ValidationSchemes";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { toast } from "react-toastify";
import styles from "./SignUpForm.module.css";
import FormTabs from "./FormTabs";  

// ── OTP Input Component ──────────────────────────────────────────────────────
const OtpInput = ({ length = 6, value, onChange }) => {
  const inputsRef = useRef([]);

  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

  const handleChange = (e, idx) => {
    const ch = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = ch;
    onChange(next.join(""));
    if (ch && idx < length - 1) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pasted) {
      onChange(pasted.padEnd(length, "").slice(0, length));
      const nextFocus = Math.min(pasted.length, length - 1);
      inputsRef.current[nextFocus]?.focus();
    }
    e.preventDefault();
  };

  return (
    <div className={styles.otpWrap} onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className={`${styles.otpBox} ${d ? styles.otpBoxFilled : styles.otpBoxEmpty}`}
          autoFocus={i === 0}
        />
      ))}
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────
const SignUpForm = () => {
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams();
  const referrer = searchParams.get("referral") || null;

  const { fireToastify } = useToastify();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCriteria, setShowCriteria] = useState(false);
  const [referralData, setReferralData] = useState(null);

  // OTP state
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [otpCode, setOtpCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [reSending, setReSending] = useState(false);
  const cooldownRef = useRef(null);

  // Countdown timer for resend
  const startCooldown = (seconds = 60) => {
    setResendCooldown(seconds);
    clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(cooldownRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };
  useEffect(() => () => clearInterval(cooldownRef.current), []);

  const oAuthState = {
      provider: "google",
      redirect: "/global-networkers",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referralCode : referrer
    }

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    ux_mode: "redirect",
    redirect_uri: process.env.NEXT_PUBLIC_OAUTH_CALLBACK_URL,
    state: JSON.stringify(oAuthState),
  });

  const appleAuthOptions = {
    clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
    scope: 'email name openid',
    redirectURI: process.env.NEXT_PUBLIC_OAUTH_CALLBACK_URL, // Google ile aynı base URL olabilir
    usePopup: false, 
    state: JSON.stringify({...oAuthState, provider : 'apple'}),
  };

  const sendConfirmationEmail = async () => {
    await client.post("/Authentication/SendSignupConfirmation", {
      firstName: formik.values.firstName,
      lastName: formik.values.lastName,
      email: formik.values.email,
    });
  }

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: referralData ? referralData.email : "",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      password: "",
      passwordRetry: "",
      termsAccepted: false,
      gdprAccepted: false,
      referralCode: referralData ? referralData.code : null,
    },
    validationSchema: SignupFormScheme,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await sendConfirmationEmail();
        setStep("otp");
        setOtpCode("");
        startCooldown(60);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setReSending(true);
    try {
      await sendConfirmationEmail();
      startCooldown(60);
      fireToastify("Verification code resent.", "success");
    } finally {
      setReSending(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (otpCode.length < 6) return;
    setLoading(true);
    try {
      const response = await client.post("/Authentication/SignUp", {
        ...formik.values,
        emailConfirmationCode: otpCode,
        referralCode: referrer,
      });
      if (response.data.success) {
        startTransition(() => {
          fireToastify("Sign-up completed. You are redirecting to the sign-in page.", "success");
          router.replace("/sign-in");
        });
      }
    } catch {
      fireToastify("Invalid or expired code. Please try again.", "error");
      setOtpCode("");
    } finally {
      setLoading(false);
    }
  };

  // Auto-submit when all 6 digits filled
  useEffect(() => {
    if (otpCode.length === 6 && step === "otp") handleOtpSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpCode]);

  const maskEmail = (email) => {
    const [user, domain] = email.split("@");
    if (!domain) return email;
    return user.slice(0, 2) + "•".repeat(Math.max(0, user.length - 2)) + "@" + domain;
  };

  return (
    <div className="login__form signin__form">
      <div className="login__form-wrapper">
        {/*
          Slider shell: clips overflow so the hidden step never bleeds into
          the page, and gives both steps an anchor for absolute positioning.
          Height is driven by whichever step is currently "in flow" (the
          visible one sits in the normal flow via the inner relative wrapper).
        */}
        <div className={styles.sliderShell}>

          {/* ── STEP: FORM ────────────────────────────────────────────── */}
          <div
            className={`${styles.step} ${styles.stepForm} ${step === "form" ? styles.stepFormVisible : styles.stepFormHidden}`}
          >
            <FormTabs activeTabIndex={1} />

            {/* <p className={styles.trialText}>
              Start your free 7-day trial. No credit card required.
            </p>

            <div className="d-flex flex-column gap-1">
              <SocialLoginButton
                provider="google"
                onClick={googleLogin}
                disabled={loading}
                labelText="Sign up with Google"
              />
              <AppleSignin
                authOptions={appleAuthOptions}
                onSuccess={(res) => console.log("res", res)} // redirect flow'da burası tetiklenmez
                onError={(err) => console.error(err)}
                render={(props) => (
                  <SocialLoginButton provider="apple" onClick={props.onClick} disabled={loading} labelText="Sign up with Apple" />
                )}
              />
            </div> */}
            {/* <div className={styles.divider}>
              <hr className={styles.dividerHr} />
              <span className={styles.dividerSpan}>or</span>
              <hr className={styles.dividerHr} />
            </div> */}

            <form
              className="needs-validation account-form"
              autoComplete="off"
              onSubmit={formik.handleSubmit}
            >
             {/* Company Name */}
              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <FormControl
                      type="companyName"
                      name="companyName"
                      value={referralData ? referralData.companyName : formik.values.companyName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.companyName && formik.errors.companyName}
                      disabled={!!referralData}
                      autoComplete="off"
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.companyName}</Form.Control.Feedback>
                  </div>
                </div>
              </div>
              {/* Email */}
              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <label className="form-label">Business Email</label>
                    <FormControl
                      type="email"
                      name="email"
                      value={referralData ? referralData.email : formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.email && formik.errors.email}
                      disabled={!!referralData}
                      autoComplete="off"
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
                  </div>
                </div>
              </div>

              {/* First / Last Name */}
              <div className="row">
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <FormControl
                      type="text"
                      name="firstName"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.firstName && formik.errors.firstName}
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.firstName}</Form.Control.Feedback>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <FormControl
                      type="text"
                      name="lastName"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.lastName && formik.errors.lastName}
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.lastName}</Form.Control.Feedback>
                  </div>
                </div>
              </div>

              {/* Password / Confirm */}
              <div className="row">
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <div className={styles.passwordWrap}>
                      <FormControl
                        type={showNewPassword ? "text" : "password"}
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={(e) => { formik.handleBlur(e); setShowCriteria(false); }}
                        onFocus={() => setShowCriteria(true)}
                        isInvalid={formik.touched.password && formik.errors.password}
                        autoComplete="off"
                      />
                      <div className="icon-wrapper-sign" onClick={() => setShowNewPassword((p) => !p)}>
                        <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                      </div>
                      <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
                    </div>

                    {showCriteria && (
                      <div id="message" className={styles.criteriaMessage}>
                        <h3>Password must contain the following:</h3>
                        {[
                          { id: "letter", test: /[a-z]/, label: <>A <b>lowercase</b> letter</> },
                          { id: "capital", test: /[A-Z]/, label: <>A <b>capital</b> letter</> },
                          { id: "number", test: /[0-9]/, label: <>A <b>number</b></> },
                          { id: "special", test: /[!@#$%^&*(),.?":{}|<>_-]/, label: <>A <b>special character</b></> },
                        ].map(({ id, test, label }) => (
                          <p key={id} id={id} className={test.test(formik.values.password) ? "valid" : ""}>{label}</p>
                        ))}
                        <p id="length" className={formik.values.password.length >= 8 ? "valid" : ""}>
                          Minimum <b>8 characters</b>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <div className={styles.passwordWrap}>
                      <FormControl
                        type={showConfirmPassword ? "text" : "password"}
                        name="passwordRetry"
                        value={formik.values.passwordRetry}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.passwordRetry && formik.errors.passwordRetry}
                      />
                      <div className="icon-wrapper-sign" onClick={() => setShowConfirmPassword((p) => !p)}>
                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                      </div>
                      <Form.Control.Feedback type="invalid">{formik.errors.passwordRetry}</Form.Control.Feedback>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="row">
                <div class="col-12">
                  <Form.Check
                    type="checkbox"
                    name="termsAccepted"
                    id="termsAccepted"
                    checked={formik.values.termsAccepted}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.errors.termsAccepted}
                    custom="true"
                    label={<>I agree to the <Link target="_blank" href="/terms-and-conditions"><u>Terms and Conditions</u></Link>.</>}
                    feedbackType="invalid"
                    feedback={formik.errors.termsAccepted}
                  />
                </div>
              </div>
              <div className="row">
                <div class="col-12">
                  <Form.Check
                    type="checkbox"
                    name="gdprAccepted"
                    id="gdprAccepted"
                    checked={formik.values.gdprAccepted}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.errors.gdprAccepted}
                    custom="true"
                    label={<>I agree to the GDPR clause of the <Link target="_blank" href="/terms-and-conditions"><u>Terms and Conditions</u></Link>.</>}
                    feedbackType="invalid"
                    feedback={formik.errors.gdprAccepted}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="row">
                <div className="mt-3">
                  <Button className="talk-button" type="submit" disabled={loading}>
                    {loading
                      ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> SIGN UP FREE</>
                      : "SIGN UP FREE"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-4">
              <p className={styles.alreadyAccount}>
                Already have an account?{" "}
                <Link href="/sign-in" className={styles.alreadyAccountLink}>
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          {/* ── STEP: OTP ─────────────────────────────────────────────── */}
          <div
            className={`${styles.step} ${styles.stepOtp} ${step === "otp" ? styles.stepOtpVisible : styles.stepOtpHidden}`}
          >
            {/* Back button */}
            <button
              onClick={() => { setStep("form"); setOtpCode(""); }}
              className={styles.backBtn}
              type="button"
            >
              ← Back
            </button>

            {/* Icon */}
            <div className={styles.envelopeCircle}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF6C00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 7l10 7 10-7" />
              </svg>
            </div>

            <h2 className={styles.otpTitle}>
              Check your inbox
            </h2>
            <p className={styles.otpSubtitle}>
              We sent a 6-digit code to
            </p>
            <p className={styles.otpEmail}>
              {maskEmail(formik.values.email)}
            </p>

            <OtpInput length={6} value={otpCode} onChange={setOtpCode} />

            <Button
              className={`talk-button ${styles.verifyBtn}`}
              onClick={handleOtpSubmit}
              disabled={isPending || loading || otpCode.length < 6}
            >
              {loading
                ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Verifying…</>
                : "Verify & Create Account"}
            </Button>

            <p className={styles.resendText}>
              Didn't receive it?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
                className={`${styles.resendBtn} ${resendCooldown > 0 ? styles.resendBtnDisabled : styles.resendBtnActive}`}
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
              </button>
            </p>

            <p className={styles.spamHint}>
              Check your spam folder if you don't see it.
            </p>
          </div>

        </div> {/* /slider shell */}
      </div>
    </div>
  );
};

export default SignUpForm;