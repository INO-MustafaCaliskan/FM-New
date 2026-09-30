"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./DashboardLayout.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHome, faUsers, faRss, faComments, faFileInvoiceDollar, faChartLine, 
  faShieldAlt, faBan, faExclamationTriangle, faCalendarAlt, faNewspaper, 
  faHeadset, faRocket, faChevronLeft, faChevronRight,
  faGlobe, faBriefcase, faLock, faUserFriends, faLifeRing, faChevronDown
} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const [openMenus, setOpenMenus] = useState({
    "Network": false,
    "Business Tools": false,
    "Protection": false,
    "Community": false,
    "Help & Support": false
  });

  const toggleMenu = (title) => {
    if (!isOpen) {
      toggleSidebar();
    }
    setOpenMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const menuGroups = [
    {
      title: null,
      items: [
        { label: "Dashboard", icon: faHome, href: "/user-dashboard" },
      ]
    },
    {
      title: "Network",
      icon: faGlobe,
      items: [
        { label: "Directory", icon: faUsers, href: "/global-networkers" },
        { label: "News Feed", icon: faRss, href: "/feed" },
        { label: "Chat", icon: faComments, href: "/chat" },
      ]
    },
    {
      title: "Business Tools",
      icon: faBriefcase,
      items: [
        { label: "Quotation System", icon: faFileInvoiceDollar, href: "/get-quote" },
        { label: "Payment Monitoring", icon: faChartLine, href: "/payment" },
      ]
    },
    {
      title: "Protection",
      icon: faLock,
      items: [
        { label: "Claim System", icon: faShieldAlt, href: "/claims" },
        { label: "Blacklisted Agents", icon: faBan, href: "/blacklisted-agents" },
        { label: "Global Warning List", icon: faExclamationTriangle, href: "/warning-list" },
      ]
    },
    {
      title: "Community",
      icon: faUserFriends,
      items: [
        { label: "Events", icon: faCalendarAlt, href: "/events" },
        { label: "News & Blog", icon: faNewspaper, href: "/news-and-blog" },
      ]
    },
    {
      title: "Help & Support",
      icon: faLifeRing,
      items: [
        { label: "Support System", icon: faHeadset, href: "/contact" },
        { label: "Get Started", icon: faRocket, href: "/get-started" },
      ]
    }
  ];

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
      {/* Kulakçık */}
      <button className={styles.sidebarToggleBtn} onClick={toggleSidebar} aria-label="Toggle Sidebar">
        <FontAwesomeIcon icon={isOpen ? faChevronLeft : faChevronRight} />
      </button>

      <div className={styles.sidebarLogo}>
        {isOpen ? (
          <Image src="/images/FM_Logo.png" alt="Logo" width={190} height={60} className={styles.logoImage} />
        ) : (
            <Image src="/images/FM_icon.png" alt="Logo" width={50} height={50} className={styles.logoImage} />
        )}
      </div>

      <nav className={styles.sidebarMenu}>
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className={styles.menuGroup}>
            {group.title ? (
              <>
                <button 
                  className={styles.menuItem} 
                  onClick={() => toggleMenu(group.title)}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', outline: 'none' }}
                >
                  <div className={styles.menuIconWrapper}>
                    <FontAwesomeIcon icon={group.icon} className={styles.menuIcon} />
                  </div>
                  <span className={styles.menuText} style={{ flex: 1, textAlign: 'left' }}>
                    {group.title}
                  </span>
                  <div className={`${styles.chevronWrapper} ${isOpen ? '' : styles.hidden}`}>
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className={`${styles.chevronIcon} ${openMenus[group.title] ? styles.chevronOpen : ''}`} 
                    />
                  </div>
                </button>

                <div className={`${styles.submenuContainer} ${openMenus[group.title] && isOpen ? styles.submenuOpen : ''}`}>
                  <div className={styles.submenuInner}>
                    {group.items.map((item, itemIndex) => (
                      <Link key={itemIndex} href={item.href} className={styles.submenuItem}>
                        <div className={styles.menuIconWrapper}>
                          <FontAwesomeIcon icon={item.icon} className={styles.submenuIcon} />
                        </div>
                        <span className={styles.menuText}>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              group.items.map((item, itemIndex) => (
                <Link key={itemIndex} href={item.href} className={styles.menuItem}>
                  <div className={styles.menuIconWrapper}>
                    <FontAwesomeIcon icon={item.icon} className={styles.menuIcon} />
                  </div>
                  <span className={styles.menuText}>{item.label}</span>
                </Link>
              ))
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}