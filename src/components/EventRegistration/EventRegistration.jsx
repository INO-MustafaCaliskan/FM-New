"use client";
import React, { useState } from "react";
import styles from "./EventRegistration.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCcVisa, faCcMastercard } from "@fortawesome/free-brands-svg-icons";
import { 
  faCalendarAlt, faClock, faMapMarkerAlt, faInfoCircle, 
  faCheckCircle, faUser, faUserFriends, faUsers, faArrowRight, faArrowLeft,
  faFileAlt, faGem, faMinusCircle, faMedal, faAward, faShieldAlt, faCertificate, 
  faMouse, faFolder, faPen, faIdBadge, faCoffee, faUtensils, faCheck, faTimes, faDownload, faCreditCard, faQuestionCircle, faLock, faHourglassHalf, faUniversity, faBullhorn, faChartLine, faUserPlus
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
  const [selectedSponsors, setSelectedSponsors] = useState([]);
  const [showAllSponsors, setShowAllSponsors] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending', 'success', 'failed'
  const [testSuccess, setTestSuccess] = useState(true);

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

  const mockFeatures = [
    "Company logo on event website",
    "Logo on event materials",
    "Recognition during the event",
    "Company visibility in selected event areas",
    "Promotional exposure to attending members",
    "One (1) complimentary delegate registration",
    "Opportunity to include promotional item in delegate bags",
    "Social media mention before and after the event"
  ];

  const sponsorshipOptions = [
    { id: 1, title: "Platinum Sponsor", price: 5550, icon: "medal", color: "#3182ce", features: mockFeatures, availability: 2 },
    { id: 2, title: "Gold Sponsor", price: 4250, icon: "award", color: "#dd6b20", features: mockFeatures, availability: 3 },
    { id: 3, title: "Silver Sponsor", price: 3270, icon: "shield", color: "#718096", features: mockFeatures, availability: 5 },
    { id: 4, title: "Bronze Sponsor", price: 2180, icon: "certificate", color: "#e53e3e", features: mockFeatures, availability: 8 },
    { id: 5, title: "Mouse Pad Sponsor", price: 1500, icon: "mouse", color: "#0047b3", features: mockFeatures, availability: 10 },
    { id: 6, title: "Folder Sponsor", price: 1000, icon: "folder", color: "#3182ce", features: mockFeatures, availability: 5 },
    { id: 7, title: "Pen Sponsor", price: 750, icon: "pen", color: "#38a169", features: mockFeatures, availability: 4 },
    { id: 8, title: "Lanyard Sponsor", price: 1500, icon: "id-badge", color: "#805ad5", features: mockFeatures, availability: 2 },
    { id: 9, title: "Coffee Break Sponsor", price: 2000, icon: "coffee", color: "#d69e2e", features: mockFeatures, availability: 1 },
    { id: 10, title: "Gala Dinner Sponsor", price: 5000, icon: "utensils", color: "#e53e3e", features: mockFeatures, availability: 1 }
  ];

  const toggleSponsor = (id) => {
    setSelectedSponsors(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const getSponsorshipPrice = () => {
    return selectedSponsors.reduce((total, id) => {
      const sp = sponsorshipOptions.find(o => o.id === id);
      return total + (sp ? sp.price : 0);
    }, 0);
  };

  const getDelegatePrice = () => delegateOptions.find(o => o.value === delegates)?.price || 0;
  const getSpousePrice = () => spouseOptions.find(o => o.value === spouses)?.price || 0;
  const getVipPrice = () => vipOptions.find(o => o.value === vipTables)?.price || 0;
  
  const totalFee = getDelegatePrice() + getSpousePrice() + getVipPrice() + getSponsorshipPrice();

  const getSponsorIcon = (iconName) => {
    switch(iconName) {
      case "medal": return faMedal;
      case "award": return faAward;
      case "shield": return faShieldAlt;
      case "certificate": return faCertificate;
      case "mouse": return faMouse;
      case "folder": return faFolder;
      case "pen": return faPen;
      case "id-badge": return faIdBadge;
      case "coffee": return faCoffee;
      case "utensils": return faUtensils;
      default: return faAward;
    }
  };

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
                let isCompleted = stepNum < currentStep;
                if (stepNum === 5 && paymentStatus === 'success') {
                  isCompleted = true;
                }
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

            {/* STEP 4: Sponsorship */}
            {currentStep === 4 && (
              <div>
                <h2 className={styles.stepTitle}>Would you like to promote your company more with sponsorship?</h2>
                <p className={styles.stepSubtitle}>Choose the sponsorship package that best fits your visibility goals during the event.</p>
                
                <div className={styles.sponsorGrid}>
                  {sponsorshipOptions.slice(0, showAllSponsors ? sponsorshipOptions.length : 8).map(opt => {
                    const isSelected = selectedSponsors.includes(opt.id);
                    return (
                      <div 
                        key={opt.id} 
                        className={`${styles.sponsorCard} ${isSelected ? styles.sponsorCardActive : ''}`}
                        onClick={() => toggleSponsor(opt.id)}
                      >
                        <div className={styles.sponsorHeader}>
                          <div className={styles.sponsorIconWrapper} style={{ color: opt.color, backgroundColor: `${opt.color}15` }}>
                            <FontAwesomeIcon icon={getSponsorIcon(opt.icon)} />
                          </div>
                          <div className={styles.sponsorInfo}>
                            <span className={styles.sponsorTitle}>{opt.title}</span>
                            <span className={styles.sponsorPrice}>USD {opt.price.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className={styles.sponsorActions}>
                          <input 
                            type="checkbox" 
                            className={styles.sponsorCheckbox} 
                            checked={isSelected}
                            onChange={() => {}}
                            onClick={(e) => e.stopPropagation()} 
                          />
                          <span className={styles.viewDetailsLink} onClick={(e) => { e.stopPropagation(); setDetailModalOpen(opt.id); }}>View Details</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!showAllSponsors && sponsorshipOptions.length > 8 && (
                  <div className={styles.showMoreBtnWrapper}>
                    <button className={styles.showMoreBtn} onClick={() => setShowAllSponsors(true)}>
                      Show More Sponsorships
                    </button>
                  </div>
                )}

                <div className={styles.infoBanner}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  You can select more than one sponsorship package.
                </div>
              </div>
            )}

            {/* STEP 5: Payment */}
            {currentStep === 5 && paymentStatus === 'pending' && (
            <div className={styles.paymentPendingBanner}>
              <FontAwesomeIcon icon={faHourglassHalf} className={styles.pendingIcon} />
              <div className={styles.pendingText}>
                <div className={styles.pendingTitle}>Payment Status: Pending</div>
                <div className={styles.pendingDesc}>Registration will be confirmed after successful payment.</div>
              </div>
            </div>
          )}
          
          {currentStep === 5 && paymentStatus === 'success' && (
            <div className={styles.paymentSuccessBanner}>
              <FontAwesomeIcon icon={faCheckCircle} />
              Payment Status: Paid by Credit Card
            </div>
          )}

          {currentStep === 5 && paymentStatus === 'failed' && (
            <div className={styles.paymentFailedBanner}>
              <FontAwesomeIcon icon={faTimes} />
              Payment Status: Failed
            </div>
          )}

          {currentStep === 5 && (
              <div>
                {/* Temporary Test Toggle */}
                {paymentStatus === 'pending' && (
                  <div style={{ marginBottom: '15px', padding: '10px', background: '#edf2f7', borderRadius: '6px', fontSize: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <strong>Developer Test Mode:</strong>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <input type="checkbox" checked={testSuccess} onChange={e => setTestSuccess(e.target.checked)} />
                      Simulate Successful Payment
                    </label>
                  </div>
                )}

                {paymentStatus === 'pending' && (
                  <>
                    <div className={styles.invoiceBanner}>
                  <div className={styles.invoiceBannerLeft}>
                    <div className={styles.invoiceIconWrapper}>
                      <FontAwesomeIcon icon={faFileAlt} />
                      <div className={styles.checkOverlay}><FontAwesomeIcon icon={faCheck} /></div>
                    </div>
                    <div className={styles.invoiceText}>
                      <div className={styles.invoiceTitle}>
                        Invoice Created <span className={styles.invoiceBadge}>Ready for Payment</span>
                      </div>
                      <div className={styles.invoiceMeta}>
                        <span>Invoice No:</span> INV-2025-1048 &nbsp;|&nbsp; <span>Status:</span> <strong>Ready for Payment</strong>
                      </div>
                      <div className={styles.invoiceDesc}>
                        Your invoice has been created successfully. You can download it now and pay either by credit card or bank transfer.
                      </div>
                    </div>
                  </div>
                  <button className={styles.btnDownload}>
                    <FontAwesomeIcon icon={faDownload} /> Download Invoice
                  </button>
                </div>

                <h2 className={styles.stepTitle}>Secure Credit Card Payment</h2>
                <p className={styles.stepSubtitle} style={{ marginBottom: "20px" }}>Your registration is almost complete. Complete your payment to confirm your registration.</p>

                <div className={styles.ccForm}>
                  <div className={styles.ccFormHeader}>
                    <div className={styles.ccFormTitle}>Payment Details</div>
                    <div className={styles.ccLogos}>
                      We accept: 
                      <FontAwesomeIcon icon={faCcVisa} className={styles.visaLogo} />
                      <FontAwesomeIcon icon={faCcMastercard} className={styles.mcLogo} />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Cardholder Name</label>
                      <div className={styles.formInputBox}>
                        <input type="text" placeholder="Enter cardholder name" />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Card Number</label>
                      <div className={styles.formInputBox}>
                        <FontAwesomeIcon icon={faCreditCard} className={styles.formInputIcon} />
                        <input type="text" placeholder="1234 5678 9012 3456" />
                      </div>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Expiry Date</label>
                      <div className={styles.formInputBox}>
                        <input type="text" placeholder="MM / YY" />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label>CVV</label>
                      <div className={styles.formInputBox}>
                        <input type="text" placeholder="123" />
                        <FontAwesomeIcon icon={faQuestionCircle} className={styles.formInputIcon} style={{ marginLeft: "auto" }} />
                      </div>
                    </div>
                  </div>

                  <div className={styles.termsRow}>
                    <input type="checkbox" className={styles.sponsorCheckbox} />
                    <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Cancellation Policy</a>.</span>
                  </div>

                  <div className={styles.ccFormFooter}>
                    <div className={styles.sslInfo}>
                      <FontAwesomeIcon icon={faShieldAlt} className={styles.sslIcon} />
                      <div className={styles.sslText}>
                        <strong>256-bit SSL secure payment</strong>
                        Your payment is processed securely.
                      </div>
                    </div>
                                        <button 
                      className={styles.btnPay} 
                      onClick={() => setPaymentStatus(testSuccess ? 'success' : 'failed')}
                    >
                      <FontAwesomeIcon icon={faLock} /> Pay USD {totalFee.toLocaleString()}
                    </button>
                  </div>
                </div>
              </>
            )}

            {paymentStatus === 'success' && (
              <div>
                <div className={styles.paymentResultHeader}>
                  <div className={`${styles.paymentResultIcon} ${styles.iconSuccess}`}>
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                  <div>
                    <h2 className={styles.paymentResultTitle}>Payment Successful</h2>
                    <div className={styles.paymentResultSubtitle}>
                      Your registration has been confirmed. Please add your participant names<br/>
                      below to complete your event profile.
                    </div>
                  </div>
                </div>

                <div className={styles.promoBanner}>
                  <div className={styles.promoBannerLeft}>
                    <FontAwesomeIcon icon={faBullhorn} />
                    <span>Add participant names now and we'll promote your delegates<br/>in the event system and attendee visibility areas.</span>
                  </div>
                  <FontAwesomeIcon icon={faChartLine} className={styles.promoBannerRight} />
                </div>

                <div className={styles.participantFormSection}>
                  <h3 className={styles.participantFormTitle}>Add Participant Names</h3>
                  <div className={styles.participantFormSubtitle}>
                    You have selected {delegates} delegate{delegates > 1 ? 's' : ''} {spouses > 0 ? `and ${spouses} spouse${spouses > 1 ? 's' : ''}` : ''}. Please provide their names below.
                  </div>

                  <div className={styles.infoAlert}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Please enter each participant's First Name and Last Name exactly as they should appear on the name badge.
                  </div>
                  <div className={styles.infoAlert}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Name badges will be printed based on the information entered below.
                  </div>

                  {/* Delegates Rows */}
                  {[...Array(delegates)].map((_, i) => (
                    <div key={`del-${i}`} className={styles.participantRow}>
                      <div className={styles.participantLabel}>
                        <FontAwesomeIcon icon={faUser} className={styles.iconDelegate} />
                        Delegate {i + 1}
                      </div>
                      <div className={styles.participantInputs}>
                        <div className={styles.formInputBox}><input type="text" placeholder="First Name" /></div>
                        <div className={styles.formInputBox}><input type="text" placeholder="Last Name" /></div>
                        <div className={styles.formInputBox}><input type="text" placeholder="Email Address" /></div>
                        <select defaultValue="">
                          <option value="" disabled>T-Shirt Size</option>
                          <option value="S">Small</option>
                          <option value="M">Medium</option>
                          <option value="L">Large</option>
                          <option value="XL">X-Large</option>
                        </select>
                      </div>
                    </div>
                  ))}

                  {/* Spouses Rows */}
                  {[...Array(spouses)].map((_, i) => (
                    <div key={`spo-${i}`} className={styles.participantRow}>
                      <div className={styles.participantLabel}>
                        <FontAwesomeIcon icon={faUser} className={styles.iconSpouse} />
                        Spouse {spouses > 1 ? i + 1 : ''}
                      </div>
                      <div className={styles.participantInputs}>
                        <div className={styles.formInputBox}><input type="text" placeholder="First Name" /></div>
                        <div className={styles.formInputBox}><input type="text" placeholder="Last Name" /></div>
                      </div>
                    </div>
                  ))}

                  <div className={styles.infoAlert}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    You can also update these details later in Community {'>'} Events {'>'} My Registrations.
                  </div>

                  <button className={styles.btnPay} style={{ marginTop: '20px' }}>
                    <FontAwesomeIcon icon={faUserPlus} /> Save
                  </button>
                </div>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div>
                <div className={styles.paymentResultHeader}>
                  <div className={`${styles.paymentResultIcon} ${styles.iconFailed}`}>
                    <FontAwesomeIcon icon={faTimes} />
                  </div>
                  <div>
                    <h2 className={styles.paymentResultTitle}>Payment Failed</h2>
                    <div className={styles.paymentResultSubtitle}>
                      We couldn't process your payment. Please check your card details<br/>
                      and try again, or use a different payment method.
                    </div>
                  </div>
                </div>
                <button 
                  className={styles.btnNext} 
                  onClick={() => setPaymentStatus('pending')}
                  style={{ marginTop: '20px' }}
                >
                  <FontAwesomeIcon icon={faArrowLeft} /> Try Again
                </button>
              </div>
            )}</div>
            )}

            {/* Placeholder for other steps */}
            {currentStep > 5 && (
              <div style={{ textAlign: 'center', padding: '50px 0', color: '#718096' }}>
                <h3>Step {currentStep} content coming soon...</h3>
              </div>
            )}

            {currentStep < 5 && (
            <div className={styles.formActions}>
              {currentStep > 1 ? (
                <button className={styles.btnBack} onClick={handleBack}>
                  <FontAwesomeIcon icon={faArrowLeft} /> Back
                </button>
              ) : <div></div>}
              
              {currentStep < 4 ? (
                <button className={styles.btnNext} onClick={handleNext}>
                  Continue <FontAwesomeIcon icon={faArrowRight} />
                </button>
              ) : currentStep === 4 ? (
                <button className={styles.btnNext} onClick={handleNext}>
                  Complete Registration and Create Invoice <FontAwesomeIcon icon={faArrowRight} />
                </button>
              ) : (
                <button className={styles.btnNext}>
                  Pay Now <FontAwesomeIcon icon={faArrowRight} />                </button>
              )}
            </div>
            )}

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
              {vipTables > 0 ? (
                <span className={styles.summaryValue}>{vipTables} VIP Table{vipTables > 1 ? 's' : ''} — USD {getVipPrice().toLocaleString()}</span>
              ) : (
                <span className={styles.summaryValue}>—</span>
              )}
            </div>
            
            <div className={styles.summaryItem} style={{ borderBottom: 'none', paddingBottom: 0, alignItems: 'flex-start' }}>
              <span className={styles.summaryLabel}>Sponsorship</span>
              {selectedSponsors.length > 0 ? (
                <div className={styles.summarySponsorList}>
                  {selectedSponsors.map(id => {
                    const sp = sponsorshipOptions.find(o => o.id === id);
                    return <span key={id} className={styles.summaryValue}>{sp.title} — USD {sp.price.toLocaleString()}</span>;
                  })}
                </div>
              ) : (
                <span className={styles.summaryValue}>—</span>
              )}
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

          {currentStep === 5 && paymentStatus === 'pending' && (
            <div className={styles.paymentPendingBanner}>
              <FontAwesomeIcon icon={faHourglassHalf} className={styles.pendingIcon} />
              <div className={styles.pendingText}>
                <div className={styles.pendingTitle}>Payment Status: Pending</div>
                <div className={styles.pendingDesc}>Registration will be confirmed after successful payment.</div>
              </div>
            </div>
          )}
          
          {currentStep === 5 && paymentStatus === 'success' && (
            <div className={styles.paymentSuccessBanner}>
              <FontAwesomeIcon icon={faCheckCircle} />
              Payment Status: Paid by Credit Card
            </div>
          )}

          {currentStep === 5 && paymentStatus === 'failed' && (
            <div className={styles.paymentFailedBanner}>
              <FontAwesomeIcon icon={faTimes} />
              Payment Status: Failed
            </div>
          )}

          {currentStep === 5 && (
            <>
              <div className={styles.paymentPendingBanner}>
                <FontAwesomeIcon icon={faHourglassHalf} className={styles.pendingIcon} />
                <div className={styles.pendingText}>
                  <div className={styles.pendingTitle}>Payment Status: Pending</div>
                  <div className={styles.pendingDesc}>Registration will be confirmed after successful payment.</div>
                </div>
              </div>
              <button className={styles.btnGoToRegistrations}>
                <FontAwesomeIcon icon={faUniversity} /> Go to My Registrations
              </button>
            </>
          )}
        </div>

      </div>

      {/* Detail Modal */}
      {detailModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setDetailModalOpen(null)}>
          {(() => {
            const sp = sponsorshipOptions.find(o => o.id === detailModalOpen);
            if (!sp) return null;
            return (
              <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.closeModalBtn} onClick={() => setDetailModalOpen(null)}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
                
                <div className={styles.modalHeader}>
                  <div className={styles.modalIconWrapper} style={{ color: sp.color, backgroundColor: `${sp.color}15` }}>
                    <FontAwesomeIcon icon={getSponsorIcon(sp.icon)} />
                  </div>
                  <div className={styles.modalTitleBox}>
                    <h3 className={styles.modalTitle}>{sp.title}</h3>
                    <span className={styles.modalPrice}>USD {sp.price.toLocaleString()}</span>
                    <span className={styles.modalAvailability}>Availability: {sp.availability} remaining</span>
                  </div>
                </div>

                <div className={styles.modalBody}>
                  <div className={styles.modalSubtitle}>Package includes:</div>
                  <div className={styles.featuresList}>
                    {sp.features.map((feat, idx) => (
                      <div key={idx} className={styles.featureItem}>
                        <FontAwesomeIcon icon={faCheck} className={styles.featureCheck} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.modalFooter}>
                  <button className={styles.modalBtnClose} onClick={() => setDetailModalOpen(null)}>
                    Close
                  </button>
                  <button 
                    className={styles.modalBtnSelect} 
                    onClick={() => {
                      if (!selectedSponsors.includes(sp.id)) {
                        setSelectedSponsors(prev => [...prev, sp.id]);
                      }
                      setDetailModalOpen(null);
                    }}
                  >
                    Select {sp.title}
                    <span>USD {sp.price.toLocaleString()}</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}