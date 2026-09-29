"use client";
import React from "react";
import styles from "./Showcase.module.css";

const MOCK_SUB_CARDS = [
  { Title: "Global Reach", SubTitle: "Connect with verified agents worldwide and expand your business.", ImageUrl: "/images/FM_Logo.png" },
  { Title: "Secure Payments", SubTitle: "Safe payment protection program for all members.", ImageUrl: "/images/FM_Logo.png" },
  { Title: "Verified Members", SubTitle: "High-quality forwarders strictly selected and verified.", ImageUrl: "/images/FM_Logo.png" },
  { Title: "Annual Meetings", SubTitle: "Meet your global partners face-to-face annually.", ImageUrl: "/images/FM_Logo.png" },
];

export default function SliderSubCards() {
  return (
    <div className={`${styles.featureArea} ${styles.sliderSubCards}`}>
      <div className="container">
        <div className={`${styles.featureAreaWrapper} ${styles.radiousSliderCard}`}>
          <div className={`row g-0 ${styles.radiousSliderCard}`}>
            {MOCK_SUB_CARDS.map((card, i) => (
              <div key={i} className="col-6 col-md-6 col-lg-3">
                <div className={`${styles.featureItem} ${(i === 0 || i === 3) ? styles.active : ""} ${i === 0 ? styles.featureItemFirst : ""} ${i === 3 ? styles.featureItemLast : ""}`}>
                  <div className={`${styles.featureIcon} ${(i === 1 || i === 2) ? styles.featureWhite : ""}`}>
                    <img src={card.ImageUrl} alt="thumb" />
                  </div>
                  <div className={styles.featureContent}>
                    <h5 className={styles.titleFeature}>{card.Title}</h5>
                    <p className={styles.justifiedText}>{card.SubTitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}