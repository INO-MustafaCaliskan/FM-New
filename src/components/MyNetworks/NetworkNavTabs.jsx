"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePendingRequestContext } from "@/context/PendingRequestContext";
import "./my-networks-list.css";

const NetworkNavTabs = () => {
  const pathname = usePathname();
  const { pendingCount } = usePendingRequestContext();

  const isPending = pathname?.includes("/pending-request");
  const isSend = pathname?.includes("/send-request") || pathname?.includes("/awaiting-request");

  return (
    <div className="network-nav-tabs-wrapper">
      <Link
        href="/my-network/pending-request"
        className={`network-nav-tab btn fw-semibold position-relative ${isPending ? "active" : ""}`}
      >
        Pending Requests
        {pendingCount > 0 && (
          <span className="nav-tab-badge">
            {pendingCount > 99 ? "99+" : pendingCount}
          </span>
        )}
      </Link>
      <Link
        href="/my-network/send-request"
        className={`network-nav-tab btn fw-semibold ${isSend ? "active" : ""}`}
      >
        Send Requests
      </Link>
    </div>
  );
};

export default NetworkNavTabs;

