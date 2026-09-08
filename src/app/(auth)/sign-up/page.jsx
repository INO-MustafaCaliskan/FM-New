"use client";
import React from "react";

import "./style.css";
import SignUpForm from "@/components/SignForms/SignUpForm";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LeftSection from "@/components/SignForms/LeftSection";

const SignUpPage = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID} locale="en-GB">
      <main className="login">
        <LeftSection />
        <SignUpForm />
      </main>
    </GoogleOAuthProvider>
  );
};

export default SignUpPage;
