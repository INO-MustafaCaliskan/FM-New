"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./DashboardLayout.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUsers, faCalendarAlt, faComments, faEnvelope, faCog, faGlobe, faSignOutAlt, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const menuItems = [
    { label: "Ana Sayfa", icon: faHome, href: "/" },
    { label: "Üyeler", icon: faUsers, href: "/global-networkers" },
    { label: "Etkinlikler", icon: faCalendarAlt, href: "/events" },
    { label: "Chat", icon: faComments, href: "/chat" },
    { label: "Ziyaretçi Mesajları", icon: faEnvelope, href: "/messages" },
  ];

  const bottomItems = [
    { label: "Profil ve Ayarlar", icon: faCog, href: "/account-settings" },
    { label: "Siteyi Görüntüle", icon: faGlobe, href: "/" },
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
        <div className={styles.menuGroup}>
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href} className={styles.menuItem}>
              <div className={styles.menuIconWrapper}>
                <FontAwesomeIcon icon={item.icon} className={styles.menuIcon} />
              </div>
              <span className={styles.menuText}>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className={styles.sidebarBottom}>
        {bottomItems.map((item, index) => (
          <Link key={index} href={item.href} className={styles.menuItem}>
             <div className={styles.menuIconWrapper}>
                <FontAwesomeIcon icon={item.icon} className={styles.menuIcon} />
             </div>
            <span className={styles.menuText}>{item.label}</span>
          </Link>
        ))}
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