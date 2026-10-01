"use client";
import React, { useState } from "react";
import styles from "./EventRegistration.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCalendarAlt, faClock, faMapMarkerAlt, faInfoCircle, 
  faCheckCircle, faUser, faUserFriends, faUsers, faArrowRight, faArrowLeft,
  faShieldAlt, faFileAlt, faGem, faMinusCircle
} from "@fortawesome/free-solid-svg-icons";


const VipTableIcon = () => (
  <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.optionIcon} style={{ margin: "0 -5px" }}>
    <rect x="20" y="6" width="24" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
    <text x="32" y="15" fill="currentColor" fontSize="8" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">VIP</text>
    <path d="M12 44 L12 28 C12 25 16 25 16 25 L20 25" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M16 44 L16 34 L22 34" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M52 44 L52 28 C52 25 48 25 48 25 L44 25" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M48 44 L48 34 L42 34" stroke="currentColor" strokeWidth="2" fill="none"/>
    <ellipse cx="32" cy="34" rx="14" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M18 34 L18 46 C18 48 46 48 46 46 L46 34" fill="none" stroke="currentColor" strokeWidth="2"/>
    <line x1="25" y1="38" x2="25" y2="47" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="32" y1="39" x2="32" y2="47" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="39" y1="38" x2="39" y2="47" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);
export default function EventRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [delegates, setDelegates] = useState(2);
  const [spouses, setSpouses] = useState(1);
  const [vipTables, setVipTables] = useState(1);

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

  const vipOptions = [
    { value: 1, label: "One VIP Table", price: 850 },
    { value: 2, label: "Two VIP Tables", price: 1700 },
    { value: 3, label: "Three VIP Tables", price: 2550 },
    { value: 0, label: "No, Thanks", price: 0 },
  ];

  const getDelegatePrice = () => delegateOptions.find(o => o.value === delegates)?.price || 0;
  const getSpousePrice = () => spouseOptions.find(o => o.value === spouses)?.price || 0;
  const getVipPrice = () => vipOptions.find(o => o.value === vipTables)?.price || 0;
  const totalFee = getDelegatePrice() + getSpousePrice() + getVipPrice();

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

            {/* STEP 3: Add-Ons (VIP Table) */}
            {currentStep === 3 && (
              <div>
                <h2 className={styles.stepTitle}>Would you like to have a VIP table?</h2>
                <p className={styles.stepSubtitle}>Reserve a VIP table to create a premium meeting experience during the event.</p>
                
                <div className={styles.optionsGrid}>
                  {vipOptions.map(opt => (
                    <div 
                      key={opt.value} 
                      className={`${styles.optionCard} ${vipTables === opt.value ? styles.optionCardActive : ''}`}
                      onClick={() => setVipTables(opt.value)}
                    >
                      {vipTables === opt.value && <FontAwesomeIcon icon={faCheckCircle} className={styles.checkIcon} />}
                      {opt.value === 0 ? (
                        <FontAwesomeIcon icon={faMinusCircle} className={styles.optionIcon} />
                      ) : (
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                          {[...Array(opt.value)].map((_, i) => (
                            <VipTableIcon key={i} />
                          ))}
                        </div>
                      )}
                      <span className={styles.optionTitle}>{opt.label}</span>
                      <span className={styles.optionPrice}>USD {opt.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.infoBanner}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  You will attend all your meetings at your own table.
                </div>
              </div>
            )}

            {/* Placeholder for other steps */}
            {currentStep > 3 && (
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
            <FontAwesomeIcon icon={faFileAlt, faGem, faMinusCircle} style={{ color: '#0047b3' }} /> Registration Summary
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
              {vipTables > 0 ? (
                <span className={styles.summaryValue}>{vipTables} VIP Table{vipTables > 1 ? 's' : ''} — USD {getVipPrice().toLocaleString()}</span>
              ) : (
                <span className={styles.summaryValue}>—</span>
              )}
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