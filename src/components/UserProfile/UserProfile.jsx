"use client";
import React from "react";
import styles from "./UserProfile.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faMapMarkerAlt, faEnvelope, faPhoneAlt, faCommentDots, faBuilding, 
  faLanguage, faStar, faBriefcase, faInfoCircle, faCalendarAlt
} from "@fortawesome/free-solid-svg-icons";

export default function UserProfile() {
  return (
    <div className={styles.container}>
      
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        Homepage / Members / Arrow Freight Links /  <span>AbdulRahim Syed</span>
      </div>

      {/* Header Profile Card */}
      <div className={styles.headerCard}>
        <div className={styles.avatarBox}>
          <img src="https://ui-avatars.com/api/?name=AbdulRahim+Syed&background=f7fafc&color=031F4B&size=200" alt="AbdulRahim Syed" className={styles.avatar} />
          {/* <div className={styles.statusIndicator}></div> */}
        </div>

        <div className={styles.userInfo}>
          <div className={styles.userNameRow}>
            <h1 className={styles.userName}>AbdulRahim Syed</h1>
            <span className={styles.badgeRole}>Head of Operations</span>
          </div>
          
          <div className={styles.userContacts}>
            <div className={styles.contactItem}>
              <FontAwesomeIcon icon={faMapMarkerAlt} /> Jeddah, Saudi Arabia
            </div>
            <div className={styles.contactItem}>
              <FontAwesomeIcon icon={faEnvelope} /> abdulrahim@arrowfreight.com
            </div>
            <div className={styles.contactItem}>
              <FontAwesomeIcon icon={faPhoneAlt} /> +966 50 123 4567
            </div>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.btnPrimary}>
            <FontAwesomeIcon icon={faCommentDots} /> CHAT
          </button>
          {/* <button className={styles.btnSecondary}>
            <FontAwesomeIcon icon={faPhoneAlt} /> CALL
          </button>
          <button className={styles.btnSecondary}>
            <FontAwesomeIcon icon={faCalendarAlt} /> SCHEDULE
          </button> */}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.contentGrid}>
        
        {/* Left Column (Main Info) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* About Me */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <FontAwesomeIcon icon={faInfoCircle} color="#3182ce" /> About Me
            </div>
            <div className={styles.aboutText}>
              <p>
                Highly accomplished and results-driven logistics professional with over 12 years of experience in the freight forwarding and supply chain industry. Currently serving as the Head of Operations at Arrow Freight Links, overseeing daily logistics, customs clearance, and international shipping operations across the Middle East.
              </p>
              <br/>
              <p>
                I specialize in optimizing supply chain workflows, reducing operational costs, and building strong relationships with international partners. Always open to connecting with global agents for mutually beneficial business opportunities.
              </p>
            </div>
          </div>

          {/* Experience */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <FontAwesomeIcon icon={faBriefcase} color="#3182ce" /> Work Experience
            </div>
            
            <div className={styles.experienceItem}>
              <div className={styles.expTitle}>Head of Operations</div>
              <div className={styles.expCompany}>Arrow Freight Links</div>
              <div className={styles.expDate}>Jan 2018 - Present · 6 yrs 9 mos</div>
              <div className={styles.expDesc}>
                Leading a team of 45 logistics coordinators. Streamlined the customs clearance process in Jeddah Port, reducing average cargo hold time by 30%. Responsible for key account management and global agency network development.
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #edf2f7', margin: '20px 0' }} />

            <div className={styles.experienceItem}>
              <div className={styles.expTitle}>Senior Logistics Manager</div>
              <div className={styles.expCompany}>Global Trans Forwarding (Riyadh)</div>
              <div className={styles.expDate}>Mar 2012 - Dec 2017 · 5 yrs 10 mos</div>
              <div className={styles.expDesc}>
                Managed end-to-end air and ocean freight shipments. Handled compliance and documentation for hazardous materials and temperature-controlled cargo.
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column (Sidebar) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Company Details */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <FontAwesomeIcon icon={faBuilding} color="#3182ce" /> Company Info
            </div>
            <div className={styles.companyWidget}>
              <div className={styles.companyWidgetLogo}>ARROW<br/>FREIGHT</div>
              <div className={styles.companyWidgetInfo}>
                <span className={styles.companyWidgetName}>Arrow Freight Links</span>
                <Link href="/company-users" className={styles.companyWidgetLink}>
                  View Company Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Specialties / Skills */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <FontAwesomeIcon icon={faStar} color="#3182ce" /> Specialties
            </div>
            <div className={styles.tagList}>
              <span className={styles.tag}>Ocean Freight (FCL/LCL)</span>
              <span className={styles.tag}>Air Freight</span>
              <span className={styles.tag}>Customs Clearance</span>
              <span className={styles.tag}>Project Cargo</span>
              <span className={styles.tag}>Supply Chain Optimization</span>
            </div>
          </div>

          {/* Languages */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <FontAwesomeIcon icon={faLanguage} color="#3182ce" /> Languages Spoken
            </div>
            <div className={styles.tagList}>
              <span className={styles.tag}>Arabic (Native)</span>
              <span className={styles.tag}>English (Fluent)</span>
              <span className={styles.tag}>Urdu (Conversational)</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}