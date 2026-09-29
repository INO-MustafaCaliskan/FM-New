"use client";
import React from "react";
import styles from "./DashboardLayout.module.css";
import { useUser } from "@/context/UserContext";

export default function Header() {
  const { user } = useUser();

  return (
    <header className={styles.header}>
      <div className={styles.headerTitle}>
        Welcome back, {user?.name || "User"}!
      </div>
      <div className={styles.headerActions}>
        <span>{user?.email}</span>
      </div>
    </header>
  );
}