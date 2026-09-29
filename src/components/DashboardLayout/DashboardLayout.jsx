"use client";
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styles from "./DashboardLayout.module.css";
import { NotificationProvider } from '@/context/NotificationContext';
import { PendingRequestProvider } from '@/context/PendingRequestContext';
import { SignalRProvider } from '@/context/SignalRContext2';

export default function DashboardLayout({ children }) {
  return (
    <div className={styles.layoutContainer}>
      <Sidebar />
      <div className={styles.mainWrapper}>
        <Header />
        <main className={styles.contentArea}>
          <SignalRProvider>
            <NotificationProvider>
              <PendingRequestProvider>
                {children}
              </PendingRequestProvider>
            </NotificationProvider>
          </SignalRProvider>
        </main>
      </div>
    </div>
  );
}