"use client";
import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import React from "react";

const PaymentFailPage = () => {
  
  const handleGoToPaymentPageClick = () => {
    window.location.href = "/pricing";
  };

  const handleGoToHomepageClick = () => {
    window.location.href = "/";
  };

  return (
    <>
      <div className="container d-flex flex-column">
        <InoBreadcrumb linkName="Payment Failed" />
        <div className="card p-3 p-md-0 p-xl-5">
          <div className="card-body">
       
            <div className="d-flex flex-column align-items-center">
              <img
                src="/images/payment_failed.png"
                alt="Payment Failed"
                style={{ width: 200, height: 200, fontSize: 48 }}
              />
              <h1 className="mb-3 ">Payment Failed!</h1>
              <p className="mb-4 text-muted">
                Unfortunately, your payment could not be processed. Please try again.
              </p>
            
              <div className="home-showcase__buttons">
                <button
                  className="btn ino-button"
                  style={{ marginRight: "5px" }}
                  onClick={handleGoToPaymentPageClick}
                >
                  Go to Payment Page
                </button> 
               <button
                  className="btn ino-button ino-button-outline ml-2"
                  onClick={handleGoToHomepageClick}
                >
                  Go to Homepage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentFailPage;
