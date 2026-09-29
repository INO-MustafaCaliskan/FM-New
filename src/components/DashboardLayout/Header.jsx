"use client";
import React from "react";
import styles from "./DashboardLayout.module.css";
import { useUser } from "@/context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function Header({ toggleSidebar }) {
  const { user } = useUser();
  const userName = user?.name || "Kullanıcı Adı";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button className={styles.mobileMenuBtn} onClick={toggleSidebar} aria-label="Menu">
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {userInitial}
          </div>
          <span className={styles.userName}>{userName}</span>
        </div>
      </div>
      <div className={styles.headerRight}>
        <div className={styles.langFlags}>
          <div className={styles.flagCircle}>TR</div>
          <div className={styles.flagCircle}>EN</div>
        </div>
      </div>
    </header>
  );
}