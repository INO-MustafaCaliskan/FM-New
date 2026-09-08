"use client";
import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faFontAwesomeFlag,
} from "@fortawesome/free-solid-svg-icons";
import "./verification.css"; // Adjust path as per your project structure
import Link from "next/link";
import client from "@/utils/client";
import InoButton from "../Buttons/InoButton";
import Image from "next/image";

const Verification = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    category: "",
    fTalkId: "",
    profilePhoto: "",
    name: "",
    jobTitle: "",
    company: "",
    countryFlag: "",
    location: "",
  });
  const [verificationFailed, setVerificationFailed] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fTalkId = e.target.fTalkId.value.trim();

    if (!fTalkId) {
      document.getElementById("errorMsg").textContent =
        "Please enter a Freight Talk ID.";
      return;
    } else {
      document.getElementById("errorMsg").textContent = "";
    }

    try {
      const response = await client.get(`/User/GetByFTalkId/${fTalkId}`);

      if (!response.data.success) {
        throw new Error("User not found");
      }
      const userData = await response.data.data;
      

      setModalContent({
        category: userData.categoryName || "Category not specified",
        fTalkId: userData.fTalkId,
        profilePhoto: userData.imageUrl || "/images/empty-image.png",
        name: `${userData.firstName} ${userData.lastName}`,
        jobTitle: userData.jobTitleName || "Job/Title not specified",
        company: userData.companyName,
        city: userData.cityName,
        countryFlag: userData.countryFlag.toLowerCase(),
        location: userData.countryName,
      });

      setVerificationFailed(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setModalContent(null);
      setVerificationFailed(true);
      setShowFailureModal(true);
    }
  };

  return (
    <section className="pb-4" >
      <div className="verification-popup__inner">
        <picture className="verification-popup__picture rounded"></picture>
        <div className="verification-popup__content">
          <h1 className="verification-popup__title">Verification</h1>
          <p className="verification-popup__desc">
            Freight Talk places utmost importance on security. Every user on our
            platform is assigned a unique ID number. This ID can be incorporated
            into business cards or email addresses for easy identification and
            verification. To confirm whether a person using a particular ID is a
            member of Freight Talk, please enter the ID number into the
            verification code area provided below. Let's ensure that each
            interaction on our platform is secure and trustworthy.
          </p>

          <form
            className="form form needs-validation"
            noValidate
            id="verificationNumber"
            onSubmit={handleSubmit}
          >
            <div className="form-column">
              <label htmlFor="fTalkId" className="form-label">
                Freight Talk ID
              </label>
              <input
                type="text"
                id="fTalkId"
                name="fTalkId"
                placeholder="Verification Code"
                className="form-control"
                required
              />
            </div>

            <label
              id="errorMsg"
              className="text-danger mt-1"
              style={{ fontSize: "15px" }}
            ></label>
            <InoButton
              id="verifyButton"
              type="submit"
              className="verify-btn mt-2"
              title="Verify"
            />
          </form>

          <p className="verification-popup__register-text">
            Don't have an account yet?{" "}
            <Link href="/sign-up" className="verification-popup__register-link">
              Try it for free
            </Link>{" "}
            for 7 days!
          </p>
        </div>
      </div>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton className="d-flex justify-content-between">
          <Modal.Title>
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-success me-2"
            />
            Verification Provided
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalContent ? (
            <div className="card ft-profile-card  text-center">
              <div className="card-header border-0">
                <div className="row">
                  <div className="col-8 text-start">
                    <b>Category</b>
                    <br />
                    <span id="categoryField">{modalContent.category}</span>
                  </div>
                  <div className="col-4 text-end">
                    <b>FTalk ID</b>
                    <br />
                    <span id="fTalkIdField">{modalContent.fTalkId}</span>
                  </div>
                </div>
              </div>
              <div className="card-body text-start">
                <div className="row">
                  <div className="col-auto">
                    <div className="ft-profile-image">
                      <Image 
                        id="profilePhoto"
                        src={modalContent.profilePhoto || "/images/empty-image.png"}
                        alt="Avatar"
                        className="img-fluid"
                        width="128"
                        height="128"
                      />
                    </div>
                  </div>
                  <div className="col d-flex flex-column position-static p-0">
                    <strong id="nameField">{modalContent.name}</strong>
                    <br />
                    <span id="jobTitleField">{modalContent.jobTitle}</span>
                    <br />
                    <div className="mb-0 ">
                      <b id="companyField">{modalContent.company}</b>
                      <br />
                      <div className="mt-2 ">
                        <span id="locationFlag">
                          {" "}
                          {modalContent.countryFlag}
                        </span>

                        <span id="city" style={{ marginLeft: 10 }}>
                          {modalContent.city ? `${modalContent.city}, ` : " "}
                        </span>
                        <span id="locationField"> {modalContent.location}</span>



                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>No data available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="button button-primary"
            onClick={() => setShowSuccessModal(false)}
          >
            CLOSE
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Failure Modal */}
      <Modal show={showFailureModal} onHide={() => setShowFailureModal(false)}>
        <Modal.Header closeButton className="d-flex justify-content-between">
          <Modal.Title>
            <FontAwesomeIcon
              icon={faTimesCircle}
              className="text-danger me-2"
            />
            Verification Failed
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>The user was not found.</Modal.Body>
        <Modal.Footer>
          <Button
            variant="button button-primary"
            onClick={() => setShowFailureModal(false)}
          >
            CLOSE
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default Verification;
