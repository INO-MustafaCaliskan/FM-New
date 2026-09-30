"use client";
import React, { useState } from "react";
import styles from "./CompanyUsers.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faMapMarkerAlt, faUsers, faUserCheck, faBuilding, 
  faStar, faPhone, faCommentDots, faCalendarAlt, faBriefcase, faEye
} from "@fortawesome/free-solid-svg-icons";

export default function CompanyUsers() {
  // Toggle this true/false to switch between flat and neumorphic design
  const [isNeumorphic, setIsNeumorphic] = useState(false);

  const MOCK_USERS = [
    { id: 1, name: "AbdulRahim Syed", role: "Head of Operations", email: "abdulrahim@arrowfreight.com", loc: "Jeddah, Saudi Arabia", dept: "Operations", status: "Online", statusClass: styles.statusOnline, avatar: "https://ui-avatars.com/api/?name=AbdulRahim+Syed&background=f7fafc&color=031F4B" },
    { id: 2, name: "Mike Smith", role: "Sales Manager", email: "mike.smith@arrowfreight.com", loc: "Jeddah, Saudi Arabia", dept: "Sales", status: "Offline", statusClass: styles.statusOffline, avatar: "https://ui-avatars.com/api/?name=Mike+Smith&background=f7fafc&color=031F4B" },
    { id: 3, name: "Sara Ahmed", role: "Customer Service", email: "sara.ahmed@arrowfreight.com", loc: "Jeddah, Saudi Arabia", dept: "Customer Service", status: "Away", statusClass: styles.statusAway, avatar: "https://ui-avatars.com/api/?name=Sara+Ahmed&background=f7fafc&color=031F4B" },
    { id: 4, name: "Faisal Khan", role: "Business Development Executive", email: "faisal.khan@arrowfreight.com", loc: "Riyadh, Saudi Arabia", dept: "Business Development", status: "Online", statusClass: styles.statusOnline, avatar: "https://ui-avatars.com/api/?name=Faisal+Khan&background=f7fafc&color=031F4B" }
  ];

  return (
    <div className={`${styles.container} ${isNeumorphic ? styles.neumorphic : ''}`}>
      
      {/* Dev Toggle for Neumorphism */}
      {/* <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          onClick={() => setIsNeumorphic(!isNeumorphic)}
          style={{ padding: '8px 16px', background: isNeumorphic ? '#3182ce' : '#e2e8f0', color: isNeumorphic ? '#fff' : '#1a202c', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Toggle Neumorphism (Currently: {isNeumorphic ? "ON" : "OFF"})
        </button>
      </div> */}

      <div className={styles.breadcrumb}>
        Homepage / Members / <span>Arrow Freight Links</span> / <span>Users</span>
      </div>

      <div className={styles.headerCard}>
        <div className={styles.companyLogoBox}>
          {/* Using text logo as placeholder */}
          <div style={{ color: '#031F4B', fontWeight: 900, fontSize: '32px', textAlign: 'center', lineHeight: '1.1' }}>
            <span style={{ color: '#e53e3e' }}>A</span><br/>ARROW<br/><span style={{ fontSize: '14px', color: '#3182ce' }}>FREIGHT</span>
          </div>
        </div>

        <div className={styles.companyInfo}>
          <div>
            <div className={styles.companyTitleRow}>
              <h1 className={styles.companyName}>Arrow Freight Links</h1>
              <span className={styles.badgePremium}>Premium Member</span>
            </div>
            <div className={styles.companyLocation}>
              <FontAwesomeIcon icon={faMapMarkerAlt} color="#3182ce" /> Jeddah, Saudi Arabia
            </div>
          </div>
          
          <div className={styles.statsRow}>
            <div className={styles.statBlock}>
              <span className={styles.statLabel}>Membership ID</span>
              <span className={styles.statValue}>250722367</span>
            </div>
            <div className={styles.statBlock}>
              <span className={styles.statLabel}>Established</span>
              <span className={styles.statValue}>2012</span>
            </div>
            <div className={styles.statBlock}>
              <span className={styles.statLabel}>Company Size</span>
              <span className={styles.statValue}>25-50 Employees</span>
            </div>
            <div className={styles.statBlock}>
              <span className={styles.statLabel}>Member Since</span>
              <span className={styles.statValue}>2012</span>
            </div>
            <div className={styles.statBlock}>
              <span className={styles.statLabel}>Valid Till</span>
              <span className={styles.statValue}>Dec 2026</span>
            </div>
          </div>
        </div>

        <div className={styles.headerRightBlocks}>
          <div className={styles.rightBlock}>
            <div className={styles.rightBlockIcon}>
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <div className={styles.rightBlockInfo}>
              <span className={styles.rightBlockVal}>3</span>
              <span className={styles.rightBlockLabel}>Registered Users</span>
            </div>
          </div>
          {/* <div className={styles.rightBlock}>
            <div className={styles.rightBlockIcon}>
              <FontAwesomeIcon icon={faUserCheck} />
              <div className={`${styles.statusDotSmall} ${styles.dotGreen}`}></div>
            </div>
            <div className={styles.rightBlockInfo}>
              <span className={styles.rightBlockVal}>1</span>
              <span className={styles.rightBlockLabel}>Available Now</span>
            </div>
          </div> */}
        </div>
      </div>

      {/* <div className={styles.tabsArea}>
        <div className={styles.tab}>
          <FontAwesomeIcon icon={faBuilding} /> Overview
        </div>
        <div className={`${styles.tab} ${styles.tabActive}`}>
          <FontAwesomeIcon icon={faUsers} /> Users
        </div>
        <div className={styles.tab}>
          <FontAwesomeIcon icon={faStar} /> Reviews
        </div>
      </div> */}

      <div className={styles.mainCard}>
        <div className={styles.mainCardTitle}>
          <FontAwesomeIcon icon={faUsers} color="#031F4B" /> Users <span>(3 Registered, 1 Available)</span>
        </div>

        <div className={styles.usersGrid}>
          {MOCK_USERS.map(user => (
            <div className={styles.userCard} key={user.id}>
              <div className={styles.userInfoRow}>
                <div className={styles.avatarBox}>
                  <img src={user.avatar} alt={user.name} className={styles.avatar} />
                </div>
                <div className={styles.userDetails}>
                  <div className={styles.nameRow}>
                    <span className={styles.userName}>{user.name}</span>
                    {/* <div className={styles.statusBadge}>
                      <div className={`${styles.statusDot} ${user.statusClass}`}></div>
                      {user.status}
                    </div> */}
                  </div>
                  <div className={styles.userRole}>{user.role}</div>
                  <div className={styles.userEmail}>{user.email}</div>
                  
                  <div className={styles.locationRow}>
                    <div className={styles.locLeft}>
                      <FontAwesomeIcon icon={faMapMarkerAlt} color="#3182ce" /> {user.loc}
                    </div>
                    {/* <div className={styles.locRight}>
                      <FontAwesomeIcon icon={faBriefcase} /> {user.dept}
                    </div> */}
                  </div>
                </div>
              </div>

              <div className={styles.actionsRow}>
                {/* 
                <button className={styles.actionBtn}>
                  <FontAwesomeIcon icon={faPhone} /> CALL
                </button> 
                */}
                <button className={styles.actionBtn}>
                  <FontAwesomeIcon icon={faEye} /> VIEW PROFILE
                </button> 
                
                <button className={styles.actionBtn}>
                  <FontAwesomeIcon icon={faCommentDots} /> CHAT
                </button>
                
                {/* 
                <button className={styles.actionBtn}>
                  <FontAwesomeIcon icon={faCalendarAlt} /> SCHEDULE
                </button> 
                */}
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}