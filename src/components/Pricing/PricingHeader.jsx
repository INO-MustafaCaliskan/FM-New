import React from "react";

export const PricingHeader = ({ title, description }) => {
  return (
    <>

      <div className="row pricing-description">
        <h1 className="fw-bold fs-3 mb-4 mt-4">Find the Right Pricing Plan for Your
          Network Platform </h1>
        <p className="fw-bold fs-4 mb-4">{title}</p>
        <p className="content-justify">{description}</p>
        <p>Can’t find exactly what you’re looking for? We’re here to help — just <a href="mailto:customer@inonetworksgroup.com" style={{ color: "#f97a29" }}>
          get in touch
        </a>.</p>
      </div>
    </>
  );
};
