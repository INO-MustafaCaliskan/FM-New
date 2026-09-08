import React, { useState } from "react";
import Image from "next/image";
import client from "@/utils/client";
import { toast } from "react-toastify";
import { FormControl } from "react-bootstrap";
import styles from './SubscribeForm.module.css';

const SubscribeForm = () => {
  const [eMail, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setIsValid(true)
    try {
      const data = {
        email: eMail,
      };
      const response = await client.post("/Subscription/Subscribe", data);
      toast.success("Thank you for your subscription.");
      setIsValid(true);
      setEmail("");
    } catch (error) {
      console.error("An error occurred:", error);
      setIsValid(false)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.footerSubscribe}>
      <p className={styles.footerTitle}>Subscribe to our newsletter</p>
      <form
        className={`form form needs-validation `}
        id="newsletterSubscriberForm"
        onSubmit={handleSubmit}
        noValidate
      >
        <label className={`${styles.footerSubscribeText} text-center`}>
          Get the monthly digest of the latest and greatest Freight Talk news,
          articles, and resources.
        </label>
        <div className={styles.footeSubscribeGroup}>
          <FormControl
            type="email"
            id="email"
            placeholder="Your email address"
            className={`form-control ${styles.footerSubscribeInput}`}
            required
            value={eMail}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className={styles.footerSubscribeButton}
            type="submit"
            disabled={isSubmitting}
          >
            <Image
              src="/images/icon-arrow-right-orange.svg"
              width="20"
              height="15"
              alt="Arrow icon"
            />
          </button>
        </div>
      </form>

    </div>

  );
};

export default SubscribeForm;
