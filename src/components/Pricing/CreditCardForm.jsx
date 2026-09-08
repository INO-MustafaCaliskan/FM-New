import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import client from "@/utils/client";
import { Modal } from "react-bootstrap";

export const CreditCardForm = ({ packageId }) => {
  const [isFailedModalOpen, setIsFailedModalOpen] = useState(false);

  /* ---------------- IP ADDRESS ---------------- */
  const getIpAddress = async () => {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      return data.ip;
    } catch {
      return "0.0.0.0";
    }
  };

  /* ---------------- CARD BRAND ---------------- */
  const getCardBrand = (cardNumber) => {
    const number = cardNumber.replace(/\s+/g, "");

    if (number.startsWith("4")) return 100; // VISA

    const firstTwo = parseInt(number.substring(0, 2));
    const firstFour = parseInt(number.substring(0, 4));

    if (
      (firstTwo >= 51 && firstTwo <= 55) ||
      (firstFour >= 2221 && firstFour <= 2720)
    ) {
      return 200; // MASTERCARD
    }

    if (number.startsWith("9792")) return 300; // TROY

    return null;
  };

  /* ---------------- 3D HTML SHOW ---------------- */
  const show3DSecureHtml = (html) => {
    document.open();
    document.write(html);
    document.close();
  };
  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (values, actions) => {
    try {
      const [expireMonth, expireYear] = values.cardDate.split("/");

      const userIp = await getIpAddress();

      const payload = {
        SubscriptionPackageId: packageId,
        NameOnCard: values.name,
        CardNumber: values.cardnumber.replace(/\s+/g, ""),
        ExpireMonth: expireMonth,
        ExpireYear: expireYear,
        SecurityCode: values.securitycode,
        Ip: userIp,
      };

      const response = await client.post(
        "/UserTransaction/AddByLoginUserCreditPayment",
        payload
      );
      const html = response?.data?.data;
      if (html && typeof html === "string" && html.includes("<html")) {
        show3DSecureHtml(html);
      } else {
        setIsFailedModalOpen(true);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setIsFailedModalOpen(true);
    } finally {
      actions.setSubmitting(false);
    }
  };

  /* ---------------- VALIDATION ---------------- */
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name on card is required")
      .matches(/^[A-Za-z\s]+$/, "Only letters allowed"),
    cardnumber: Yup.string()
      .required("Card number is required")
      .matches(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, "Invalid card format"),
    cardDate: Yup.string()
      .required("Expiry date is required")
      .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "MM/YY format"),
    securitycode: Yup.string()
      .required("Security code is required")
      .matches(/^\d{3}$/, "CVV must be 3 digits"),
  });

  return (
    <div className="card card-body">
      <p className="fw-bold">Make Payment</p>

      <Formik
        initialValues={{
          name: "",
          cardnumber: "",
          cardDate: "",
          securitycode: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          errors,
          touched,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            {/* NAME */}
            <div className="mb-3">
              <label>Name on Card</label>
              <input
                className="form-control"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.name && errors.name && (
                <div className="error-text">{errors.name}</div>
              )}
            </div>

            {/* CARD NUMBER */}
            <div className="mb-3">
              <label>Card Number</label>
              <input
                className="form-control"
                name="cardnumber"
                inputMode="numeric"
                value={values.cardnumber}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, "")
                    .match(/.{1,4}/g)
                    ?.join(" ")
                    .substring(0, 19);
                  handleChange({
                    target: { name: "cardnumber", value: value || "" },
                  });
                }}
                onBlur={handleBlur}
              />
              {touched.cardnumber && errors.cardnumber && (
                <div className="error-text">{errors.cardnumber}</div>
              )}
            </div>

            {/* EXPIRY */}
            <div className="mb-3">
              <label>Expiry Date (MM/YY)</label>
              <input
                className="form-control"
                name="cardDate"
                value={values.cardDate}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length > 2)
                    value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
                  handleChange({
                    target: { name: "cardDate", value },
                  });
                }}
                onBlur={handleBlur}
              />
              {touched.cardDate && errors.cardDate && (
                <div className="error-text">{errors.cardDate}</div>
              )}
            </div>

            {/* CVV */}
            <div className="mb-3">
              <label>Security Code (CVV)</label>
              <input
                className="form-control"
                name="securitycode"
                inputMode="numeric"
                value={values.securitycode}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.securitycode && errors.securitycode && (
                <div className="error-text">{errors.securitycode}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-secondary w-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Make Payment"}
            </button>
          </form>
        )}
      </Formik>

      {/* PAYMENT FAILED MODAL */}
      <Modal
        show={isFailedModalOpen}
        onHide={() => setIsFailedModalOpen(false)}
      >
        <Modal.Header className="d-lex justify-content-between">
          <Modal.Title className="">Payment Failed</Modal.Title>
          <button
            type="button"
            className="btn-close"
            onClick={() => setIsFailedModalOpen(false)}
            aria-label="Close"
          ></button>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column align-items-center">
            <img
              src="/images/payment_failed.png"
              alt="Payment Failed"
              style={{ width: 150, height: 150, fontSize: 48 }}
            />
            <h1 className="mb-3 " style={{ color: "#f97a29" }}>
              Payment Failed!
            </h1>
            <p className="mb-4 text-muted">
              Unfortunately, your payment could not be processed. Please try
              again.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setIsFailedModalOpen(false)}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
