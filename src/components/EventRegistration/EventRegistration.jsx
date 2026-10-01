"use client";
import React, { useState } from "react";
import styles from "./EventRegistration.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCalendarAlt, faClock, faMapMarkerAlt, faInfoCircle, 
  faCheckCircle, faUser, faUserFriends, faUsers, faArrowRight, faArrowLeft,
  faShieldAlt, faFileAlt
} from "@fortawesome/free-solid-svg-icons";

export default function EventRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [delegates, setDelegates] = useState(2);
  const [spouses, setSpouses] = useState(1);

  const delegateOptions = [
    { value: 1, label: "1 Delegate", price: 1150 },
    { value: 2, label: "2 Delegates", price: 2150 },
    { value: 3, label: "3 Delegates", price: 3150 },
    { value: 4, label: "4 Delegates", price: 4150 },
  ];

  const spouseOptions = [
    { value: 0, label: "None", price: 0 },
    { value: 1, label: "1 Spouse", price: 500 },
    { value: 2, label: "2 Spouses", price: 1000 },
    { value: 3, label: "3 Spouses", price: 1500 },
    { value: 4, label: "4 Spouses", price: 2000 },
  ];

  const getDelegatePrice = () => delegateOptions.find(o => o.value === delegates)?.price || 0;
  const getSpousePrice = () => spouseOptions.find(o => o.value === spouses)?.price || 0;
  const totalFee = getDelegatePrice() + getSpousePrice();

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderDelegateIcons = (count) => {
    if (count === 1) return <FontAwesomeIcon icon={faUser} className={styles.optionIcon} />;
    if (count === 2) return <FontAwesomeIcon icon={faUserFriends} className={styles.optionIcon} />;
    return <FontAwesomeIcon icon={faUsers} className={styles.optionIcon} />;
  };

  const renderSpouseIcons = (count) => {
    if (count === 0) return <FontAwesomeIcon icon={faUser} className={styles.optionIcon} />;
    if (count === 1) return <FontAwesomeIcon icon={faUser} className={styles.optionIcon} />;
    if (count === 2) return <FontAwesomeIcon icon={faUserFriends} className={styles.optionIcon} />;
    return <FontAwesomeIcon icon={faUsers} className={styles.optionIcon} />;
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>INO Summit 2026 Registration</h1>
        <p className={styles.pageSubtitle}>Complete your registration for INO Summit 2026 in a few simple steps.</p>
      </div>

      <div className={styles.layoutGrid}>
        
        {/* LEFT COLUMN */}
        <div className={styles.leftColumn}>
          
          {/* Event Summary Card */}
          <div className={styles.eventSummaryCard}>
            <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80" alt="Event" className={styles.eventImg} />
            <div className={styles.eventInfo}>
              <div className={styles.eventTitleRow}>
                <h3 className={styles.eventTitle}>INO Summit 2026 Annual General Meeting</h3>
                <span className={styles.badgePhysical}>Physical</span>
              </div>
              <div className={styles.eventDetailsRow}>
                <div className={styles.detailItem}>
                  <FontAwesomeIcon icon={faCalendarAlt} /> Oct 13-14, 2026
                </div>
                <div className={styles.detailItem}>
                  <FontAwesomeIcon icon={faClock} /> 09:00 AM - 05:00 PM (UTC+3)
                </div>
                <div className={styles.detailItem}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> Istanbul Convention Center, Istanbul, Turkiye
                </div>
              </div>
              <span className={styles.pricingNotice}>Member pricing is applied automatically.</span>
            </div>
          </div>

          {/* Form Card */}
          <div className={styles.formCard}>
            
            {/* Stepper */}
            <div className={styles.stepper}>
              {['Delegates', 'Spouses', 'Add-Ons', 'Sponsorship', 'Payment'].map((stepName, idx) => {
                const stepNum = idx + 1;
                const isActive = stepNum === currentStep;
                const isCompleted = stepNum < currentStep;
                return (
                  <div key={stepNum} className={`${styles.step} ${isActive ? styles.stepActive : ''} ${isCompleted ? styles.stepCompleted : ''}`}>
                    <div className={styles.stepCircle}>
                      {isCompleted ? <FontAwesomeIcon icon={faCheckCircle} /> : stepNum}
                    </div>
                    <span className={styles.stepLabel}>{stepName}</span>
                  </div>
                );
              })}
            </div>

            {/* STEP 1: Delegates */}
            {currentStep === 1 && (
              <div>
                <h2 className={styles.stepTitle}>How many delegates will attend the event?</h2>
                <p className={styles.stepSubtitle}>Select the number of delegates joining your company for the event.</p>
                
                <div className={styles.optionsGrid}>
                  {delegateOptions.map(opt => (
                    <div 
                      key={opt.value} 
                      className={`${styles.optionCard} ${delegates === opt.value ? styles.optionCardActive : ''}`}
                      onClick={() => setDelegates(opt.value)}
                    >
                      {delegates === opt.value && <FontAwesomeIcon icon={faCheckCircle} className={styles.checkIcon} />}
                      {renderDelegateIcons(opt.value)}
                      <span className={styles.optionTitle}>{opt.label}</span>
                      <span className={styles.optionPrice}>USD {opt.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.infoBanner}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Event registration excludes hotel accommodation.
                </div>
              </div>
            )}

            {/* STEP 2: Spouses */}
            {currentStep === 2 && (
              <div>
                <h2 className={styles.stepTitle}>How many spouses will accompany the delegates?</h2>
                <p className={styles.stepSubtitle}>Select the number of spouses joining the event with your delegates.</p>
                
                <div className={styles.optionsGrid} style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                  {spouseOptions.map(opt => (
                    <div 
                      key={opt.value} 
                      className={`${styles.optionCard} ${spouses === opt.value ? styles.optionCardActive : ''}`}
                      onClick={() => setSpouses(opt.value)}
                    >
                      {spouses === opt.value && <FontAwesomeIcon icon={faCheckCircle} className={styles.checkIcon} />}
                      {renderSpouseIcons(opt.value)}
                      <span className={styles.optionTitle}>{opt.label}</span>
                      <span className={styles.optionPrice}>USD {opt.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.infoBanner}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  A spouse can only attend welcome cocktail and gala dinner.
                </div>
              </div>
            )}

            {/* Placeholder for other steps */}
            {currentStep > 2 && (
              <div style={{ textAlign: 'center', padding: '50px 0', color: '#718096' }}>
                <h3>Step {currentStep} content coming soon...</h3>
              </div>
            )}

            <div className={styles.formActions}>
              {currentStep > 1 ? (
                <button className={styles.btnBack} onClick={handleBack}>
                  <FontAwesomeIcon icon={faArrowLeft} /> Back
                </button>
              ) : <div></div>}
              
              {currentStep < 5 ? (
                <button className={styles.btnNext} onClick={handleNext}>
                  Continue <FontAwesomeIcon icon={faArrowRight} />
                </button>
              ) : (
                <button className={styles.btnNext}>
                  Pay Now <FontAwesomeIcon icon={faArrowRight} />
                </button>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN - Summary */}
        <div className={styles.summaryCard}>
          <div className={styles.summaryHeader}>
            <FontAwesomeIcon icon={faFileAlt} style={{ color: '#0047b3' }} /> Registration Summary
          </div>
          
          <div className={styles.summaryList}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Delegates</span>
              <span className={styles.summaryValue}>{delegates} Delegate{delegates > 1 ? 's' : ''} — USD {getDelegatePrice().toLocaleString()}</span>
            </div>
            
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Spouses</span>
              {spouses > 0 ? (
                <span className={styles.summaryValue}>{spouses} Spouse{spouses > 1 ? 's' : ''} — USD {getSpousePrice().toLocaleString()}</span>
              ) : (
                <span className={styles.summaryValue}>—</span>
              )}
            </div>
            
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>VIP Table</span>
              <span className={styles.summaryValue}>—</span>
            </div>
            
            <div className={styles.summaryItem} style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <span className={styles.summaryLabel}>Sponsorship</span>
              <span className={styles.summaryValue}>—</span>
            </div>
          </div>
          
          <div style={{ borderTop: '1px solid #edf2f7', paddingTop: '15px' }}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total Fee</span>
              <span className={styles.totalValue}>USD {totalFee.toLocaleString()}</span>
            </div>
          </div>

          <div className={styles.membershipBanner}>
            <FontAwesomeIcon icon={faShieldAlt} />
            Current Membership: Basic
          </div>
        </div>

      </div>
    </div>
  );
}