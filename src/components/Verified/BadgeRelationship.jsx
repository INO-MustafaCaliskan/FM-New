import React from "react";
import "./verified.css";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";
import { IoShieldCheckmarkSharp } from "react-icons/io5";

const BadgeRelationship = () => {
  return (
    <>
      <h2 className="verified-title text-center p-0 m-0">
        HOW ARE THE BADGES RELATED?
      </h2>
      <div className="verified-page-relationship-wrapper">
        <div className="verified-page-relationship-info">
          <h3>EACH BADGE SERVES A DIFFERENT PURPOSE.</h3>

          <p>
            The Blue Badge is the foundation of all badges. The Green Badge and
            Orange Badge are independent of each other.
          </p>

          <div className="verified-page-relationship-list">
            <div>
              <FaCheckCircle />
              <span>
                The Green Badge is not required to earn the Orange Badge.
              </span>
            </div>

            <div>
              <FaCheckCircle />
              <span>
                The Orange Badge is not required to earn the Green Badge.
              </span>
            </div>
          </div>
        </div>

        <div className="verified-page-relationship-center">
          <div className="verified-page-diagram">
            <div className="verified-page-top-badge">
              <div className="verified-page-diagram-badge blue">
                <RiVerifiedBadgeFill className="icon-badge" />

                <div>
                  <h4>VERIFIED USER</h4>
                  <h5>BLUE BADGE</h5>
                  <p>Foundation of trust badge</p>
                </div>
              </div>
            </div>

            <div className="verified-page-connector-left" />
            <div className="verified-page-connector-right" />

            <div className="verified-page-bottom-row">
              <div className="verified-page-diagram-badge gray">
                <RiVerifiedBadgeFill className="icon-badge" />

                <div>
                  <h4>VERIFIED COMPANY</h4>
                  <h5>GREEN BADGE</h5>
                  <p>Corporate verification badge</p>
                </div>
              </div>

              <div className="verified-badge-middle-wrapper">
                <div className="verified-badge-middle-arrow" />
                <div className="verified-badge-middle-text">Independent</div>
              </div>

              <div className="verified-page-diagram-badge orange">
                <RiVerifiedBadgeFill className="icon-badge" />

                <div>
                  <h4>VERIFIED NETWORKER</h4>
                  <h5>ORANGE BADGE</h5>
                  <p>Community achievement badge</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="verified-page-relationship-success">
          <div className="d-flex gap-2 align-items-start justify-content-start">
            <IoShieldCheckmarkSharp />

            <h3>Earning a badge increases your visibility and credibility.</h3>
          </div>

          <p>
            Each badge helps build greater trust and unlocks more business
            opportunities.
          </p>
        </div>
      </div>
    </>
  );
};

export default BadgeRelationship;
