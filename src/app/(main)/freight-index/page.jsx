"use client";

import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import "./freight-index.css";

export default function FreightIndexPage() {
  return (

  
      
      <div className="container">
            <InoBreadcrumb linkName="Freight Index" />
        <div className="freight-index-content">
          <div className="under-construction-container">
            <h1>Freight Index</h1>
            <div className="construction-message">
              <span className="status-badge">🏗️ Under Construction</span>
              <p>This page is currently being developed and will be available soon.</p>
            </div>
          </div>
        </div>
      </div>
   
  );
}
