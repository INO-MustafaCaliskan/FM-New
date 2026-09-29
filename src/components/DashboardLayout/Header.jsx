"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./DashboardLayout.module.css";
import { useUser } from "@/context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBars, faChevronDown, faChevronRight, faPowerOff, 
  faCreditCard, faCog, faExternalLinkAlt, faUser, faShoppingCart, faBell, faCheckCircle
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { SignOut } from "@/utils/authActions";
import { useRouter } from "next/navigation";

export default function Header({ toggleSidebar }) {
  const { user } = useUser();
  const router = useRouter();
  const userName = user?.name || "Kemal K.";
  const companyName = user?.companyName || "FM TEAM TEST COMPANY-1";
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await SignOut();
    router.push("/sign-in");
  };

  return (
    <div className={styles.headerWrapper}>
      < div className={styles.headerUser}>
        <div className={styles.headerLeft}>
          <button className={styles.mobileMenuBtn} onClick={toggleSidebar} aria-label="Menu">
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className={styles.headerLogoBox}>
            <div className={styles.circleLogo}>
              <span style={{color: "#e53e3e", fontWeight: "bold"}}>F</span>
              <span style={{color: "#3182ce", fontWeight: "bold"}}>M</span>
            </div>
            <span className={styles.headerCompanyName}>{companyName}</span>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.headerBadge}>
            <FontAwesomeIcon icon={faCheckCircle} /> Basic Active
          </div>
          
          <div className={styles.headerIconBtn}>
            <FontAwesomeIcon icon={faShoppingCart} />
            <span className={styles.headerIconBadge}>7</span>
          </div>

          <div className={styles.headerIconBtn}>
            <FontAwesomeIcon icon={faBell} />
            <span className={styles.headerIconBadge}>27</span>
          </div>

          <div className={styles.userDropdownContainer} ref={dropdownRef}>
            <div className={styles.userDropdownTrigger} onClick={() => setDropdownOpen(!dropdownOpen)}>
              <span className={styles.userName}>{userName}</span>
              <div className={styles.userAvatar}>
                 <FontAwesomeIcon icon={faUser} />
              </div>
              <FontAwesomeIcon icon={faChevronDown} className={styles.triggerChevron} />
            </div>

            {dropdownOpen && (
              <div className={styles.userDropdownMenu}>
                <div className={styles.dropdownHeaderArea}>
                  <div className={styles.dropdownAvatarLarge}>
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <div className={styles.dropdownUserInfo}>
                    <div className={styles.dropdownCompany}>{companyName}</div>
                    <div className={styles.dropdownName}>{userName}</div>
                    <div className={styles.dropdownStatus}>
                      <span className={styles.statusDot}></span> Basic Membership • Pending Review
                    </div>
                  </div>
                </div>
                
                <div className={styles.dropdownDivider}></div>
                
                <Link href="/company-profile" className={styles.dropdownItem}>
                  <FontAwesomeIcon icon={faUser} className={styles.dropdownIcon} />
                  Company Profile
                </Link>
                <Link href="/payment" className={styles.dropdownItem}>
                  <FontAwesomeIcon icon={faCreditCard} className={styles.dropdownIcon} />
                  <span style={{flex: 1}}>Payment and Billing</span>
                  <FontAwesomeIcon icon={faChevronRight} className={styles.dropdownRightIcon} />
                </Link>
                <Link href="/settings" className={styles.dropdownItem}>
                  <FontAwesomeIcon icon={faCog} className={styles.dropdownIcon} />
                  Account Settings
                </Link>
                <Link href="/public-profile" className={styles.dropdownItem}>
                  <FontAwesomeIcon icon={faExternalLinkAlt} className={styles.dropdownIcon} />
                  Go to Public Profile
                </Link>
                
                <div className={styles.dropdownDivider}></div>
                
                <button className={`${styles.dropdownItem} ${styles.dropdownLogout}`} onClick={handleLogout}>
                  <FontAwesomeIcon icon={faPowerOff} className={styles.dropdownIcon} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}