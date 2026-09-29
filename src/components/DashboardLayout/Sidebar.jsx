"use client";
import React from "react";
import Link from "next/link";
import styles from "./DashboardLayout.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>
        FM Dashboard
      </div>
      <nav className={styles.sidebarMenu}>
        <Link href="/" className={styles.menuItem}>
          <FontAwesomeIcon icon={faHome} style={{ width: "20px", marginRight: "10px" }} /> Home
        </Link>
        <Link href="/user-profile" className={styles.menuItem}>
          <FontAwesomeIcon icon={faUser} style={{ width: "20px", marginRight: "10px" }} /> Profile
        </Link>
        <Link href="/account-settings" className={styles.menuItem}>
          <FontAwesomeIcon icon={faCog} style={{ width: "20px", marginRight: "10px" }} /> Settings
        </Link>
      </nav>
      <div className={styles.sidebarMenu} style={{ justifyContent: "flex-end", flex: 1, paddingBottom: "20px" }}>
        <Link href="/" className={styles.menuItem}>
          <FontAwesomeIcon icon={faSignOutAlt} style={{ width: "20px", marginRight: "10px" }} /> Sign Out
        </Link>
      </div>
    </aside>
  );
}