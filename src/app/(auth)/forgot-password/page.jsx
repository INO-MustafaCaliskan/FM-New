import React from 'react'
import InoLink from "@/components/InoLink/InoLink";
import { Image } from "react-bootstrap";
import ForgetPassword from '@/components/ForgetPassword/ForgetPassword';

const page = () => {
  return (
    <main className="login">
      <div className="login__promotion">
        <InoLink
          hrefLink={"/"}
          className={"login__promotion-logo"}
          element={
            <Image
              src="/images/freight-talk-logo.png"
              alt="Freight Talk"
              height={60}
              width={196}
            />
          }
        />

        <h2 className="login__promotion-title">
          Forgot Password ?
        </h2>

        <p className="login__promotion-text">
        No problem! Enter the email address <br /> 
        associated with your account, and we'll send you 
        a link to reset your password.
        </p>
        <picture className="signup__picture">
          <Image
            src="/images/login-promotion-sign-up.png"
            width={420}
            height={407}
            alt="Forgot Password Image"
            className="signup__image"
          />
        </picture>
      </div>
       
       <ForgetPassword  />



    </main>

  )
}

export default page