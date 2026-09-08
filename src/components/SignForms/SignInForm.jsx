"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import InoButton from "../Buttons/InoButton";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useGoogleLogin } from '@react-oauth/google';
import AppleSignin from 'react-apple-signin-auth';
import SocialLoginButton from "@/components/SignForms/SocialLoginButton";
import { useTransition } from 'react'
import InoLoading from "../InoLoading/InoLoading";
import styles from "./SignInForm.module.css";
import FormTabs from "./FormTabs";


// {
//   authorization : code, id_token, state,
//   user : email, name : {firstName, lastname}
// }

const SignInForm = () => {
  const [isPending, startTransition] = useTransition()
  const { login } = useUser();
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const savedEmail = useRef(
    typeof window !== "undefined" ? localStorage.getItem("email") : ""
  );
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/global-networkers";

  const oAuthState = { provider: 'google', redirect: redirectPath, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }
  const appleAuthOptions = {
    clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
    scope: 'email name openid',
    redirectURI: process.env.NEXT_PUBLIC_OAUTH_CALLBACK_URL, // Google ile aynı base URL olabilir
    usePopup: false, 
    state: JSON.stringify({...oAuthState, provider : 'apple'}),
  };

  // bunu açınca kullanıcı sayfayı açtığında otomatik olarak google one-tap login popup'ı açılıyor.
  // useGoogleOneTapLogin({
  //   onSuccess: async (response) => {
  //     console.log("Google One Tap login successful. Response:", response);
  //     await handleSuccess(response);
  //   },
  //   onError: () => setFormError('Google login failed.'),
  // });

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'redirect',
    redirect_uri: process.env.NEXT_PUBLIC_OAUTH_CALLBACK_URL,
    state: JSON.stringify(oAuthState),
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues: {
      email: savedEmail.current || "",
      password: "",
      rememberMe: savedEmail.current,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      setFormError("");
      setLoading(true);

      const loginResult = await login("email", {
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });
      if (loginResult.success) {
        toast.success("Sign-in successful. Redirecting...");
        startTransition(() => {
          router.replace(redirectPath);
        })

      } else {
        setFormError(loginResult.message || "Login failed. Please try again.");
        setLoading(false);
      }
    },
  });

  // bu sadece one-tap ve <GoogleLogin /> componenti için. Googledan aldığı code'u jwt'ye dönüştürüp öyle veriyor.
  const handleSuccess = async (credentials) => {
    setLoading(true);
    setFormError('');
    const loginResult = await login("oauth", { idToken: credentials.credential, provider: "google" });
    if (loginResult.success) {
      toast.success("Sign-in successful. Redirecting...");
      router.replace(redirectPath);
    } else {
      setFormError(loginResult.message || "Login failed. Please try again.");
      setLoading(false);
    }
  };

  if (isPending) return <InoLoading />

  return (
    <div className="login__form">
      <div className="login__form-wrapper">
        <FormTabs activeTabIndex={0} />
        {/* Title and description */}
        <p className={styles.description}>
          Sign in with your email and password, or use your Google account.
        </p>

        <div className="d-flex flex-column gap-1">
          <SocialLoginButton provider="google" onClick={googleLogin} disabled={loading} />
          <AppleSignin
            authOptions={appleAuthOptions}
            onSuccess={(res) => console.log("res", res)} // redirect flow'da burası tetiklenmez
            onError={(err) => console.error(err)}
            render={(props) => (
              <SocialLoginButton provider="apple" onClick={props.onClick} disabled={loading} />
            )}
          />
        </div>

        {/* Google login button - full width */}
        {/* <div className="login__google-wrapper d-flex justify-content-center mb-1 position-relative">
          <GoogleLogin
            useOneTap
            onSuccess={handleSuccess}
            onError={() => {
              setFormError('Google login failed. Please try again.')
              if(process.env.NODE_ENV === 'development'){
                console.error("Uygulama Google consolda publish edilmediyse kendi hesabınla giremezsin. Test kullanıcılarına eklenmesi lazım.")
              }
            }}
            width={240}
          />
          {loading && (
            <div style={{
              position: 'absolute',
              inset: 0,
              cursor: 'progress',
              zIndex: 1,
            }} />
          )}
        </div> */}

        {/* Divider between Google login and email form */}
        <div className={styles.divider}>
          <hr className={styles.dividerLine} />
          <span className={styles.dividerText}>or</span>
          <hr className={styles.dividerLine} />
        </div>

        <form
          className="needs-validation"
          onSubmit={formik.handleSubmit}
        >
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label className="form-label">E-Mail</label>
                <FormControl
                  type="text"
                  name="email"
                  id="email"
                  placeholder="E-Mail"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.email && formik.errors.email}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-danger mt-1">{formik.errors.email}</div>
                ) : null}
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label className="form-label">Password</label>
                <div
                  className={styles.passwordWrapper}
                >
                  <FormControl
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="current-password"
                    isInvalid={
                      formik.touched.password && formik.errors.password
                    }
                  />
                  <div
                    className={styles.iconWrapper}
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </div>
                </div>
                {formik.touched.password && formik.errors.password ? (
                  <div className=" text-danger mt-1">
                    {formik.errors.password}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="form-group d-flex justify-content-between align-items-center">
              <label className="form-checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  id="remember"
                  className="form-checkbox-input"
                  checked={formik.values.rememberMe}
                  onChange={formik.handleChange}
                />
                <span className="form-checkbox-text">Remember Me</span>
              </label>

              <Link href="/forgot-password" className={styles.forgot_link}>
                Forgot Password
              </Link>
            </div>
            {formError && (
              <div className="alert alert-danger text-center mb-3" role="alert">
                {formError}
              </div>
            )}
          </div>
          <div className="row">
            <div className="mt-3">
              <InoButton width="100%" isLoading={loading || isPending} disabled={loading || isPending} title="SIGN IN" />
            </div>
          </div>
        </form>
        <div className="mt-4">
          {/* Prompt for users without an account */}
          <p className={styles.signupNotice}>
            Don't have an account? <Link href="/sign-up" className={styles.signupLink}>Create now !</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
