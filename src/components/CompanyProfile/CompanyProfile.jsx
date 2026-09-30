"use client";
import React, { useState } from "react";
import styles from "./CompanyProfile.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBuilding, faMapMarkerAlt, faEnvelope, faPhoneAlt, faGlobe, faUsers, 
  faCheckCircle, faShip, faPlane, faTruck, faInfoCircle, faChartPie,
  faCogs, faBoxes, faRoute
} from "@fortawesome/free-solid-svg-icons";

export default function CompanyProfile() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className={styles.container}>
      
      <div className={styles.breadcrumb}>
        Homepage / Members / <span>Arrow Freight Links</span>
      </div>

      <div className={styles.layoutGrid}>
        
        {/* SIDEBAR */}
        <div className={styles.sidebar}>
          <div className={styles.logoBox}>
            <div style={{ color: '#031F4B', fontWeight: 900, fontSize: '28px', textAlign: 'center', lineHeight: '1.1' }}>
              <span style={{ color: '#e53e3e' }}>A</span><br/>ARROW<br/><span style={{ fontSize: '12px', color: '#3182ce' }}>FREIGHT</span>
            </div>
          </div>
          
          <div className={styles.companyName}>Arrow Freight Links</div>
          <div className={styles.companyBadge}>Premium Member</div>
          
          <div className={styles.sidebarInfo}>
            <div className={styles.infoItem}>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <span>Jeddah, Saudi Arabia</span>
            </div>
            <div className={styles.infoItem}>
              <FontAwesomeIcon icon={faEnvelope} />
              <span>info@arrowfreight.com</span>
            </div>
            <div className={styles.infoItem}>
              <FontAwesomeIcon icon={faPhoneAlt} />
              <span>+966 12 345 6789</span>
            </div>
            <div className={styles.infoItem}>
              <FontAwesomeIcon icon={faGlobe} />
              <Link href="#" style={{ color: '#3182ce', textDecoration: 'none' }}>www.arrowfreight.com</Link>
            </div>
            <div className={styles.infoItem}>
              <FontAwesomeIcon icon={faUsers} />
              <span>25-50 Employees</span>
            </div>
          </div>

          <Link href="/company-users" style={{ width: '100%', textDecoration: 'none' }}>
            <button className={styles.btnPrimary}>
              <FontAwesomeIcon icon={faUsers} /> View All Users
            </button>
          </Link>
        </div>

        {/* MAIN CONTENT */}
        <div className={styles.mainContent}>
          
          <div className={styles.tabsArea}>
            <div 
              className={`${styles.tab} ${activeTab === 'profile' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </div>
            <div 
              className={`${styles.tab} ${activeTab === 'reviews' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews (12)
            </div>
          </div>

          {activeTab === 'profile' && (
            <>
              {/* Company Introduction */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <FontAwesomeIcon icon={faBuilding} /> Company Introduction
                </div>
                <div className={styles.cardBodyText}>
                  <p>
                    Arrow Freight Links is a leading logistics and freight forwarding company based in Saudi Arabia, offering a comprehensive suite of supply chain solutions. With over a decade of experience, we specialize in air freight, ocean freight, road transportation, and customs clearance services.
                  </p>
                  <br/>
                  <p>
                    Our mission is to provide fast, secure, and cost-effective logistics services tailored to our clients' unique needs. We boast a robust network of global partners, ensuring seamless door-to-door delivery across continents.
                  </p>
                </div>
              </div>

              {/* Key Performance Indicators */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <FontAwesomeIcon icon={faChartPie} /> Key Performance Indicators
                </div>
                <div className={styles.chartsRow}>
                  <div className={styles.chartBox}>
                    <div className={styles.chartTitle}>Transport Modes</div>
                    <div className={styles.chartPlaceholder} style={{ background: 'conic-gradient(#3182ce 0% 50%, #38a169 50% 80%, #dd6b20 80% 100%)' }}>
                      <span style={{ background: '#fff', color: '#000', padding: '10px', borderRadius: '50%' }}>Sea/Air/Road</span>
                    </div>
                  </div>
                  <div className={styles.chartBox}>
                    <div className={styles.chartTitle}>Freight Source</div>
                    <div className={styles.chartPlaceholder} style={{ background: 'conic-gradient(#805ad5 0% 60%, #e53e3e 60% 100%)' }}>
                       <span style={{ background: '#fff', color: '#000', padding: '10px', borderRadius: '50%' }}>Partners/Own</span>
                    </div>
                  </div>
                  <div className={styles.chartBox}>
                    <div className={styles.chartTitle}>Business Direction</div>
                    <div className={styles.chartPlaceholder} style={{ background: 'conic-gradient(#319795 0% 40%, #d69e2e 40% 100%)' }}>
                       <span style={{ background: '#fff', color: '#000', padding: '10px', borderRadius: '50%' }}>Import/Export</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services & Solutions */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <FontAwesomeIcon icon={faCogs} /> Services & Solutions
                </div>
                <div className={styles.servicesGrid}>
                  
                  <div className={styles.serviceGroup}>
                    <div className={styles.serviceTitle}>
                      <FontAwesomeIcon icon={faRoute} /> Transport Modes
                    </div>
                    <div className={styles.serviceDesc}>Multiple transport options to move your cargo globally.</div>
                    <div className={styles.serviceList}>
                      <div className={styles.serviceItem}><FontAwesomeIcon icon={faShip} /> Sea Freight</div>
                      <div className={styles.serviceItem}><FontAwesomeIcon icon={faPlane} /> Air Freight</div>
                      <div className={styles.serviceItem}><FontAwesomeIcon icon={faTruck} /> Road Freight</div>
                      <div className={styles.serviceItem}><FontAwesomeIcon icon={faBoxes} /> FCL / LCL Services</div>
                    </div>
                  </div>

                  <div className={styles.serviceGroup}>
                    <div className={styles.serviceTitle}>
                      <FontAwesomeIcon icon={faInfoCircle} /> Specialized Solutions
                    </div>
                    <div className={styles.serviceDesc}>Industry-focused expertise for unique cargo.</div>
                    <div className={styles.serviceList}>
                      <div className={styles.serviceItem}><FontAwesomeIcon icon={faCheckCircle} /> Cold Chain</div>
                      <div className={styles.serviceItem}><FontAwesomeIcon icon={faCheckCircle} /> Dangerous Goods</div>
                      <div className={styles.serviceItem}><FontAwesomeIcon icon={faCheckCircle} /> Project Cargo / Heavy Lift</div>
                      <div className={styles.serviceItem}><FontAwesomeIcon icon={faCheckCircle} /> Automotive Logistics</div>
                    </div>
                  </div>

                  <div className={styles.serviceGroup}>
                    <div className={styles.serviceTitle}>
                      <FontAwesomeIcon icon={faCogs} /> Service Types
                    </div>
                    <div className={styles.serviceDesc}>End-to-end services to streamline operations.</div>
                    <div className={styles.serviceList}>
                      <div className={styles.serviceItem}><FontAwesomeIcon icon={faCheckCircle} /> Customs Clearance</div>
                      <div className={styles.serviceItem}><FontAwesomeIcon icon={faCheckCircle} /> Warehousing</div>
                      <div className={styles.serviceItem}><FontAwesomeIcon icon={faCheckCircle} /> Cross Trade</div>
                      <div className={styles.serviceItem}><FontAwesomeIcon icon={faCheckCircle} /> Integrated Logistics</div>
                    </div>
                  </div>

                </div>
              </div>
            </>
          )}

          {activeTab === 'reviews' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <FontAwesomeIcon icon={faCheckCircle} /> Reviews
              </div>
              <div className={styles.cardBodyText}>
                <p>There are no reviews for this company yet.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}