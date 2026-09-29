"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import styles from "./Showcase.module.css";
import SliderSubCards from "./SliderSubCards";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "@/context/UserContext";

const MOCK_SLIDER_DATA = [
  {
    ImageUrl: "/images/banner-home-hero_1.webp",
    MainTitle: "WELCOME TO\nFREIGHT MIDPOINT",
    SubTitle: "THE RIGHT NETWORK FOR\nFREIGHT FORWARDERS",
    Description: "Join the most reliable freight forwarders network and grow your business with trusted partners worldwide.",
    HasFirstButton: true,
    FirstButtonText: "Apply Now",
    FirstButtonUrl: "/sign-up",
    HasSecondButton: false,
    SecondButtonText: "",
    SecondButtonUrl: ""
  },
  {
    ImageUrl: "/images/banner-home-hero.png",
    MainTitle: "GLOBAL LOGISTICS\nNETWORK",
    SubTitle: "CONNECTING PROFESSIONALS\nWORLDWIDE",
    Description: "Experience seamless global logistics partnerships and expand your reach.",
    HasFirstButton: true,
    FirstButtonText: "Discover",
    FirstButtonUrl: "/global-networkers",
    HasSecondButton: true,
    SecondButtonText: "Learn More",
    SecondButtonUrl: "/about"
  }
];

const SLIDE_INTERVAL = 5000;

export default function Showcase() {
  const { user } = useUser();
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % MOCK_SLIDER_DATA.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(goToNext, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [goToNext]);

  return (
    <>
      <div className={styles.heroSlider}>
        {MOCK_SLIDER_DATA.map((item, index) => (
          <div
            key={index}
            className={`${styles.heroSingle} ${index === currentIndex ? styles.active : ""}`}
            style={{ backgroundImage: `url(${item.ImageUrl})` }}
          >
            <div className="container">
              <div className="row align-items-center">
                <div className="col-md-7 col-lg-7">
                  <div className={styles.heroContent}>
                    <h6 className={styles.heroSubTitle}>
                      {item.MainTitle.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </h6>
                    <h1 className={styles.heroTitle}>
                      {item.SubTitle.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </h1>
                    <p className={styles.heroDesc}>
                      {item.Description.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </p>
                    <div className={styles.heroBtn}>
                      {item.HasFirstButton && !user && (
                        <Link href={item.FirstButtonUrl} className={styles.themeBtn}>
                          {item.FirstButtonText} <FontAwesomeIcon icon={faArrowRight} style={{marginLeft: "8px"}} />
                        </Link>
                      )}
                      {item.HasSecondButton && (
                        <Link href={item.SecondButtonUrl} className={styles.themeBtn}>
                          {item.SecondButtonText} <FontAwesomeIcon icon={faArrowRight} style={{marginLeft: "8px"}} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SliderSubCards />
    </>
  );
}