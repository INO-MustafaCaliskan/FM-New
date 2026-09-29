"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./DashboardLayout.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHome, faUsers, faRss, faComments, faFileInvoiceDollar, faChartLine, 
  faShieldAlt, faBan, faExclamationTriangle, faCalendarAlt, faNewspaper, 
  faHeadset, faRocket, faSignOutAlt, faChevronLeft, faChevronRight 
} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const menuGroups = [
    {
      title: null, // No category header
      items: [
        { label: "Dashboard", icon: faHome, href: "/" },
      ]
    },
    {
      title: "Network",
      items: [
        { label: "Directory", icon: faUsers, href: "/global-networkers" },
        { label: "News Feed", icon: faRss, href: "/feed" },
        { label: "Chat", icon: faComments, href: "/chat" },
      ]
    },
    {
      title: "Business Tools",
      items: [
        { label: "Quotation System", icon: faFileInvoiceDollar, href: "/get-quote" },
        { label: "Payment Monitoring", icon: faChartLine, href: "/payment" },
      ]
    },
    {
      title: "Protection",
      items: [
        { label: "Claim System", icon: faShieldAlt, href: "/claims" },
        { label: "Blacklisted Agents", icon: faBan, href: "/blacklisted-agents" },
        { label: "Global Warning List", icon: faExclamationTriangle, href: "/warning-list" },
      ]
    },
    {
      title: "Community",
      items: [
        { label: "Events", icon: faCalendarAlt, href: "/events" },
        { label: "News & Blog", icon: faNewspaper, href: "/news-and-blog" },
      ]
    },
    {
      title: "Help & Support",
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
          <Image src="/images/FM_Logo.png" alt="Logo" width={160} height={45} className={styles.logoImage} />
        ) : (
          <div className={styles.logoIcon}>FM</div>
        )}
      </div>

      <nav className={styles.sidebarMenu}>
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className={styles.menuGroup}>
            {group.title && (
              <div className={styles.menuGroupTitle}>
                {group.title}
              </div>
            )}
            {group.items.map((item, itemIndex) => (
              <Link key={itemIndex} href={item.href} className={styles.menuItem}>
                <div className={styles.menuIconWrapper}>
                  <FontAwesomeIcon icon={item.icon} className={styles.menuIcon} />
                </div>
                <span className={styles.menuText}>{item.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className={styles.sidebarBottom}>
        <button className={`${styles.menuItem} ${styles.logoutItem}`} style={{border:"none", background:"none", cursor:"pointer", width:"100%"}}>
          <div className={styles.menuIconWrapper}>
            <FontAwesomeIcon icon={faSignOutAlt} className={styles.menuIcon} />
          </div>
          <span className={styles.menuText}>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}