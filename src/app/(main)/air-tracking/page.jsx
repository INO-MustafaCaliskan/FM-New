"use client";

import { faPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import Script from "next/script";
import "./air-tracking.css";

export default function AirTrackingPage() {
  return (
    <div className="air-tracking-page">
      <div className="container">
        <InoBreadcrumb linkName="Air Cargo Tracking" />

        <div className="air-tracking-content">
          <div className="under-construction-container">
            <div className="d-flex justify-content-between align-items-center gap-10 w-100">
              <h1 style={{ fontSize: "25px", fontWeight: "400" }}>
                Air Cargo Tracking
              </h1>

              <div className="page-badge">
                <span className="status-badge-text">
                  <FontAwesomeIcon icon={faPlane} />
                  &nbsp;Air Cargo Tracking
                </span>
              </div>
            </div>

            <p>
              This advanced tool is an air freight shipment tracking software
              powered by reliable global data sources to provide a handy and
              robust interface. Our state-of-the-art digital logistics tool is
              necessary to easily obtain your air container status tracking to
              achieve complete shipment visibility and fully manage your supply
              chain. Air freight tracking has never been so easy and
              comprehensive before! Discover how our tool ensures all-out track
              air shipment across the globe.
            </p>

         
            
            <div className="construction-message">
              <span className="status-badge">🏗️ Under Construction</span>
              <p>
                This page is currently being developed and will be available
                soon.
              </p>
            </div>
           

            {/* <div
              id="tracking_system_root"
              data-filter='{"platform":"PLATFORM_ID","lang":"en"}'
            />

            <Script
              src="https://www.searates.com/air/widget"
              strategy="afterInteractive"
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}