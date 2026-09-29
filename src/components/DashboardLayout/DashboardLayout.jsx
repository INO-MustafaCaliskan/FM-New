"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styles from "./DashboardLayout.module.css";
import { NotificationProvider } from '@/context/NotificationContext';
import { PendingRequestProvider } from '@/context/PendingRequestContext';
import { SignalRProvider } from '@/context/SignalRContext2';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className={styles.layoutContainer}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`${styles.mainWrapper} ${isSidebarOpen ? styles.mainExpanded : styles.mainCollapsed}`}>
        <Header toggleSidebar={toggleSidebar} />
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