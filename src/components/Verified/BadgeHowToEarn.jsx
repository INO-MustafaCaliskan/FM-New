import React from "react";
import { FaBuilding, FaUsers, FaChartLine } from "react-icons/fa";
import { LiaIdCard } from "react-icons/lia";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { FaArrowRightLong } from "react-icons/fa6";

const BadgeHowToEarn = () => {
  return (
    <div className="verified-how-wrapper">
      <h2 className="verified-how-title">HOW TO EARN BADGES?</h2>

      <div className="verified-how-grid">
        {/* STEP 1 */}

        <div className="verified-how-card verified-how-card-blue">
          <div className="d-flex  gap-3 align-items-start ">
            <div className="verified-how-number">1</div>

            <div className="verified-how-header">
              <h3>EARN TRUST FIRST</h3>
              <span>Verified User</span>
            </div>
          </div>
          <div className="verified-how-content d-flex align-items-start">
            <div className="verified-how-icon-box d-flex gap-2">
              <LiaIdCard style={{ width: "60px", fontSize: "60px" }} />
              <p className="mt-2" style={{ maxWidth: "150px" }}>
                Complete your profile, purchase a package, attend meetings, and
                receive reviews.
              </p>
            </div>

            <div className="verified-how-badge">
              <RiVerifiedBadgeFill />
            </div>
          </div>
        </div>

        <div className="verified-how-arrow">
          <FaArrowRightLong />
        </div>

        {/* STEP 2 */}

        <div className="verified-how-card verified-how-card-orange">
          <div className="d-flex  gap-4 align-items-start ">
            <div className="verified-how-number">2</div>

            <div className="verified-how-header">
              <h3>ADVANCE TOWARD YOUR GOALS</h3>
            </div>
          </div>
          <div className="verified-how-step2">
            <div>
              <FaBuilding />
              <p>
                Verify your   <br /> company
                <br />
                (Green Badge Application)
              </p>
            </div>

            <span>OR</span>

            <div>
              <FaUsers />
              <p>
                Attend more meetings
                <br />
                (Orange Badge)
              </p>
            </div>
          </div>
        </div>

        <div className="verified-how-arrow">
          <FaArrowRightLong />
        </div>

        {/* STEP 3 */}

        <div className="verified-how-card verified-how-card-green">
          <div className="d-flex  gap-3 align-items-start ">
            <div className="verified-how-number">3</div>

            <div className="verified-how-header">
              <h3>STRENGTHEN YOUR REPUTATION</h3>
            </div>
          </div>

          <div className=" d-flex gap-5 align-items-center justify-content-between mt-4">
            <p>
              Attend more meetings, receive more reviews, and increase your
              visibility within the Freight Talk community.
            </p>
            <div className="verified-how-step3-icon">
              <FaChartLine />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeHowToEarn;
