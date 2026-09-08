// "use client";

// import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
// import "./container-tracking.css";

// export default function ContainerTrackingPage() {
//   return (
//       <div className="container">
//          <InoBreadcrumb linkName="Container Tracking" />
//         <div className="container-tracking-content">
//           <div className="under-construction-container">
//             <h1>Container Tracking</h1>
//             <div className="construction-message">
//               <span className="status-badge">🏗️ Under Construction</span>
//               <p>This page is currently being developed and will be available soon.</p>
//             </div>
//           </div>
//         </div>
//       </div>

//   );
// }

"use client";

import { faBox } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import Script from "next/script";
import "./container-tracking.css";

export default function ContainerTrackingPage() {
  return (
    <div className="container-tracking-page">
      <div className="container">
        <InoBreadcrumb linkName="Container Tracking" />

        <div className="container-tracking-content">
          <div className="under-construction-container">
            <div className="d-flex justify-content-between align-items-center gap-10 w-100">
              <h1 style={{ fontSize: "25px", fontWeight: "400" }}>
                Container Tracking
              </h1>

              <div className="page-badge">
                <span className="status-badge-text">
                  <FontAwesomeIcon icon={faBox} />
                  &nbsp; Container Tracking
                </span>
              </div>
            </div>

            <p>
             Our Container Tracking tool provides accurate and up-to-date shipment visibility by integrating data from leading ocean carriers and logistics networks worldwide. Easily track your containers, monitor transit milestones, and access real-time status updates throughout the entire shipping journey. Designed to improve supply chain transparency and operational efficiency, our platform gives you the information you need to manage global cargo movements with confidence.
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
