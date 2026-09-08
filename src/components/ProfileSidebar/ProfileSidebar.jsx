"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import moment from "moment-timezone";
import Cookies from "js-cookie";
import client from "@/utils/client";
import { useUser } from "@/context/UserContext";
import "./ProfileSidebar.css";

const safeText = (value) => value ?? "";

const setStatusClassName = (status) => {
  switch (status) {
    case 1:
      return "available";
    case 2:
      return "away";
    case 3:
      return "busy";
    default:
      return "offline";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

export default function ProfileSidebar({
  userInfo = {},
  onScheduleClick,
  onCallClick,
  onChatClick,
  ownProfileActionLabel = "Update My Profile",
  ownProfileActionHref = "/profile-edit",
  className = "",
  style = {}
}) {
  const { user } = useUser();
  const isOwnProfile = user?.id === userInfo?.id;
  const isAuthenticated = !!Cookies.get("accessToken");

  // userInfo may come straight from UserContext (/User/GetLoginUserInfo), which
  // doesn't include meeting/review stats. Fetch them once when they're missing.
  const [ownStats, setOwnStats] = useState(null);
  useEffect(() => {
    setOwnStats(null);
    if (!isOwnProfile || !userInfo?.id || userInfo.meetingCount !== undefined) {
      return;
    }
    client
      .get(`/User/GetOnlineNetworkerDetailById/${userInfo.id}`)
      .then((response) => setOwnStats(response.data.data))
      .catch((error) => console.error(error));
  }, [isOwnProfile, userInfo?.id, userInfo?.meetingCount]);

  const displayInfo = ownStats ? { ...userInfo, ...ownStats } : userInfo;

  const fullName = `${safeText(displayInfo.firstName)} ${safeText(displayInfo.lastName)}`;
  const formattedTimeZone = moment.tz(displayInfo?.timeZone).format("Z");

  return (
    <div className={`profile-sidebar ${className}`} style={style}>
      {/* Avatar */}
      <div className="profile-sidebar-avatar-wrap">
        <div className="ft-profile-page-image">
          {isAuthenticated && (
            <i className={setStatusClassName(displayInfo.onlineStatus)} />
          )}
          <Image
            src={displayInfo.imageUrl || "/images/empty-image.png"}
            alt="profile"
            width={120}
            height={120}
            className="rounded-circle border"
          />
        </div>
        <h5 className="profile-sidebar-name">{safeText(fullName)}</h5>
        <p className="profile-sidebar-job">{safeText(displayInfo.jobTitleName)}</p>
        <p className="profile-sidebar-company">{safeText(displayInfo.companyName)}</p>
        <div className="profile-sidebar-location">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>
            {safeText(displayInfo.cityName)}
            {displayInfo.cityName && displayInfo.countryName ? ", " : ""}
            {safeText(displayInfo.countryName)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="profile-sidebar-divider" />

      {/* Meta info */}
      <div className="profile-sidebar-meta">
        <div className="profile-meta-row">
          <span className="profile-meta-label">Registration</span>
          <span className="profile-meta-value">
            {formatDate(displayInfo.registrationDate)}
          </span>
        </div>
        <div className="profile-meta-row">
          <span className="profile-meta-label">FTalk ID</span>
          <span className="profile-meta-value">{safeText(displayInfo.fTalkId)}</span>
        </div>
        <div className="profile-meta-row">
          <span className="profile-meta-label">Timezone</span>
          <span className="profile-meta-value">GMT{safeText(formattedTimeZone)}</span>
        </div>
        <div className="profile-meta-row">
          <span className="profile-meta-label"></span>
          <span className="profile-meta-value profile-meta-tz">
            {safeText(displayInfo.timeZone)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="profile-sidebar-divider" />

      {/* Statistics */}
      <div className="profile-sidebar-stats">
        <div className="profile-stat-item">
          <span className="profile-stat-value">{displayInfo.meetingCount ?? "—"}</span>
          <span className="profile-stat-label">Meetings</span>
        </div>
        <div className="profile-stat-divider" />
        <div className="profile-stat-item">
          <span className="profile-stat-value">{displayInfo.reviewAvg ?? "—"}</span>
          <span className="profile-stat-label">Rating</span>
        </div>
        <div className="profile-stat-divider" />
        <div className="profile-stat-item">
          <span className="profile-stat-value">{displayInfo.reviewCount ?? "—"}</span>
          <span className="profile-stat-label">Reviews</span>
        </div>
      </div>

      {isOwnProfile && (
        <>
          <div className="profile-sidebar-divider" />
          <div className="profile-sidebar-actions">
            <Link
              href={ownProfileActionHref}
              className="btn ino-button col-12 d-flex align-items-center justify-content-center text-center"
            >
              {ownProfileActionLabel}
            </Link>
          </div>
        </>
      )}

      {!isOwnProfile && (
        <>
          <div className="profile-sidebar-divider" />
          <div className="profile-sidebar-actions">
            <button
              onClick={onScheduleClick}
              className="btn ft-btn-message quick-message-chatbox-btn col-12 ino-button"
            >
              <div className="spinner-border quick-chat-spinner" role="status"></div>
              SCHEDULE
            </button>
            <button onClick={onCallClick} className="btn ft-btn-call w-100 call-modal">
              <div className="spinner-border quick-chat-spinner" role="status"></div>
              CALL
            </button>
            <button onClick={onChatClick} className="btn ino-chat-button col-12">
              <div className="spinner-border quick-chat-spinner" role="status"></div>
              CHAT
            </button>
          </div>

          <div className="profile-sidebar-divider" />
          {!user && (
            <div className="profile-sidebar-connect">
              <div className="profile-connect-header">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v4" />
                </svg>
              </div>
              <h6 className="profile-connect-title">Connect with</h6>
              <p className="profile-connect-name">{safeText(fullName)}</p>
              <p className="profile-connect-text">
                Start a video call, send a message, request a quote or schedule a
                meeting
              </p>
              <p className="profile-connect-disclaimer">
                Join Freight Talk to unlock communication and business
                opportunities.
              </p>
              <button
                className="btn profile-connect-button"
                onClick={() => (window.location.href = "/pricing/")}
              >
                Start Free 7-Day Trial
              </button>
              <p className="profile-connect-footer">No credit card required</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
